-- =====================================================
-- AI Text Humanizer - Supabase Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USER PROFILES TABLE
-- =====================================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('guest', 'free', 'pro', 'pro_plus')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" 
    ON user_profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON user_profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON user_profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. USAGE LIMITS TABLE
-- =====================================================
CREATE TABLE usage_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL, -- Format: "2025-10"
    tries_used INTEGER DEFAULT 0,
    tries_limit INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month_year)
);

-- Enable Row Level Security
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for usage_limits
CREATE POLICY "Users can view own usage" 
    ON usage_limits FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" 
    ON usage_limits FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" 
    ON usage_limits FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 3. SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'pro_plus')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscription" 
    ON subscriptions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" 
    ON subscriptions FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription" 
    ON subscriptions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 4. GUEST USAGE TRACKING (localStorage fallback)
-- =====================================================
CREATE TABLE guest_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address TEXT,
    fingerprint TEXT,
    tries_used INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(fingerprint)
);

-- Enable Row Level Security (public read for guest tracking)
ALTER TABLE guest_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public guest usage tracking" 
    ON guest_usage FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- =====================================================
-- 5. TRANSACTION HISTORY TABLE
-- =====================================================
CREATE TABLE transaction_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    input_text TEXT NOT NULL,
    output_text TEXT NOT NULL,
    transformations_applied TEXT[],
    processing_time FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE transaction_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transaction_history
CREATE POLICY "Users can view own transactions" 
    ON transaction_history FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" 
    ON transaction_history FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 6. HELPER FUNCTIONS
-- =====================================================

-- Function to get user's monthly usage limit based on tier
CREATE OR REPLACE FUNCTION get_monthly_limit(tier TEXT)
RETURNS INTEGER AS $$
BEGIN
    CASE tier
        WHEN 'guest' THEN RETURN 1;
        WHEN 'free' THEN RETURN 5;
        WHEN 'pro' THEN RETURN 100;
        WHEN 'pro_plus' THEN RETURN 500;
        ELSE RETURN 0;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can make a request
CREATE OR REPLACE FUNCTION can_user_transform(user_uuid UUID, tier TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    current_month TEXT;
    current_usage INTEGER;
    usage_limit INTEGER;
BEGIN
    -- Get current month in format "YYYY-MM"
    current_month := TO_CHAR(NOW(), 'YYYY-MM');
    
    -- Get monthly limit for tier
    usage_limit := get_monthly_limit(tier);
    
    -- Get current usage for this month
    SELECT COALESCE(tries_used, 0) INTO current_usage
    FROM usage_limits
    WHERE user_id = user_uuid AND month_year = current_month;
    
    -- If no record exists, usage is 0
    IF current_usage IS NULL THEN
        current_usage := 0;
    END IF;
    
    -- Check if user is within limit
    RETURN current_usage < usage_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_usage(user_uuid UUID, tier TEXT)
RETURNS VOID AS $$
DECLARE
    current_month TEXT;
    usage_limit INTEGER;
BEGIN
    -- Get current month in format "YYYY-MM"
    current_month := TO_CHAR(NOW(), 'YYYY-MM');
    
    -- Get monthly limit for tier
    usage_limit := get_monthly_limit(tier);
    
    -- Insert or update usage record
    INSERT INTO usage_limits (user_id, month_year, tries_used, tries_limit)
    VALUES (user_uuid, current_month, 1, usage_limit)
    ON CONFLICT (user_id, month_year) 
    DO UPDATE SET 
        tries_used = usage_limits.tries_used + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. TRIGGERS
-- =====================================================

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for usage_limits
CREATE TRIGGER update_usage_limits_updated_at
    BEFORE UPDATE ON usage_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for subscriptions
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. INDEXES
-- =====================================================

CREATE INDEX idx_usage_limits_user_month ON usage_limits(user_id, month_year);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_transaction_history_user ON transaction_history(user_id);
CREATE INDEX idx_guest_usage_fingerprint ON guest_usage(fingerprint);

-- =====================================================
-- 9. INITIAL DATA
-- =====================================================

-- Insert default subscription tiers configuration (optional)
CREATE TABLE subscription_tiers (
    tier TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    monthly_limit INTEGER NOT NULL,
    price_monthly DECIMAL(10, 2),
    price_yearly DECIMAL(10, 2),
    features TEXT[]
);

INSERT INTO subscription_tiers (tier, name, monthly_limit, price_monthly, price_yearly, features) VALUES
('guest', 'Guest', 1, 0, 0, ARRAY['1 free trial', 'No signup required']),
('free', 'Free', 5, 0, 0, ARRAY['5 transformations/month', 'Basic features', 'Email support']),
('pro', 'Pro', 100, 9.99, 99.99, ARRAY['100 transformations/month', 'Advanced features', 'Priority support', 'API access']),
('pro_plus', 'Pro+', 500, 29.99, 299.99, ARRAY['500 transformations/month', 'All features', '24/7 support', 'API access', 'Custom integrations']);

-- =====================================================
-- DONE! 🎉
-- =====================================================
-- 
-- NEXT STEPS:
-- 1. Copy this SQL to Supabase SQL Editor
-- 2. Run the script
-- 3. Get your Supabase API keys
-- 4. Configure authentication providers (email, Google, GitHub)
-- 5. Set up Stripe for payments
-- 
-- =====================================================

