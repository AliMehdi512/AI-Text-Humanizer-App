# 🔐 Authentication & Subscription System

## Overview

Your AI Text Humanizer now has a complete authentication and subscription system with:

- ✅ **Login/Signup Pages** with modern UI
- ✅ **Guest Mode** (1 free trial, no signup)
- ✅ **Usage Tracking** (per user/tier)
- ✅ **Subscription Tiers** (Free, Pro, Pro+)
- ✅ **Supabase Integration** (auth + database)
- ⏳ **Stripe Integration** (coming soon)
- ⏳ **User Dashboard** (coming soon)

## 🎁 Subscription Tiers

| Tier | Tries/Month | Price | Features |
|------|-------------|-------|----------|
| **Guest** | 1 | $0 | • 1 free trial<br>• No signup required |
| **Free** | 5 | $0 | • 5 transformations/month<br>• Basic features<br>• Email support |
| **Pro** | 100 | $9.99 | • 100 transformations/month<br>• Advanced features<br>• Priority support<br>• API access |
| **Pro+** | 500 | $29.99 | • 500 transformations/month<br>• All features<br>• 24/7 support<br>• API access<br>• Custom integrations |

## 📁 File Structure

```
AI-Text-Humanizer-App/
├── auth.html                   # Login/Signup page
├── config.js                   # Configuration (Supabase, Stripe)
├── auth-integration.js         # Authentication logic
├── supabase-schema.sql         # Database schema
├── SUPABASE_SETUP.md          # Setup guide
└── index.html                  # Main app (with auth integration)
```

## 🚀 How It Works

### 1. **Guest Mode**
```javascript
// User clicks "Continue as Guest"
localStorage.setItem('userMode', 'guest');
localStorage.setItem('guestTriesUsed', '0');
// Redirects to main app
// Limited to 1 transformation
```

### 2. **User Registration**
```javascript
// User signs up
supabase.auth.signUp({ email, password })
// Creates user profile in database
supabase.from('user_profiles').insert({
    id: user.id,
    email: email,
    subscription_tier: 'free' // Default tier
})
```

### 3. **Usage Tracking**
```javascript
// Before transformation
if (!canUserTransform()) {
    // Show upgrade modal
    return;
}

// After transformation
incrementUsage(); // Updates database
saveTransaction(); // Saves to history
```

### 4. **Database Schema**
```sql
-- User Profiles
user_profiles (id, email, full_name, subscription_tier)

-- Usage Limits
usage_limits (user_id, month_year, tries_used, tries_limit)

-- Subscriptions
subscriptions (user_id, tier, status, stripe_subscription_id)

-- Transaction History
transaction_history (user_id, input_text, output_text, transformations_applied)
```

## 🔧 Setup Instructions

### Step 1: Set Up Supabase
1. Follow `SUPABASE_SETUP.md`
2. Run `supabase-schema.sql` in SQL Editor
3. Configure authentication providers
4. Get API keys

### Step 2: Update Configuration
1. Open `config.js`
2. Replace placeholders:
   ```javascript
   SUPABASE: {
       URL: 'https://YOUR_PROJECT_ID.supabase.co',
       ANON_KEY: 'YOUR_ANON_KEY'
   }
   ```
3. Open `auth.html`
4. Replace placeholders (same values)

### Step 3: Test Locally
1. Open `auth.html` in browser
2. Test:
   - ✅ Guest mode (1 try)
   - ✅ Sign up (gets 5 tries)
   - ✅ Sign in
   - ✅ Social login (if configured)
   - ✅ Usage tracking
   - ✅ Upgrade modal

### Step 4: Deploy
1. Commit all changes
2. Push to GitHub
3. GitHub Pages will auto-deploy
4. Test live version

## 📊 User Flow

### New User (Guest)
```
1. Lands on auth.html
2. Clicks "Continue as Guest"
3. Gets 1 free trial
4. After using trial, sees upgrade modal
5. Can sign up for 5 free tries/month
```

### New User (Signup)
```
1. Lands on auth.html
2. Enters email/password
3. Verifies email (if enabled)
4. Gets 5 free tries/month
5. Can upgrade to Pro/Pro+ anytime
```

### Returning User
```
1. Lands on auth.html
2. Signs in
3. Loads usage data
4. Continues transforming (within limit)
5. Can view history & stats
```

## 🎨 UI Components

### Navigation (Top Right)
```html
<!-- Guest Mode -->
<div class="usage-badge">🎁 0/1</div>
<button>Sign Up for More</button>

<!-- Authenticated -->
<div class="usage-badge">⚡ 3/5</div>
<div class="tier-badge">Free</div>
<div class="user-dropdown">
    <button>username ▼</button>
    <div class="dropdown-menu">
        • Dashboard
        • Upgrade Plan
        • History
        • Sign Out
    </div>
</div>
```

### Upgrade Modal
```html
<div class="upgrade-modal">
    <h2>Upgrade Your Plan</h2>
    <div class="pricing-cards">
        <!-- Free, Pro, Pro+ cards -->
        <button>Upgrade Now</button>
    </div>
</div>
```

## 🔒 Security Features

### Row Level Security (RLS)
```sql
-- Users can only see their own data
CREATE POLICY "Users can view own profile" 
    ON user_profiles FOR SELECT 
    USING (auth.uid() = id);

-- Prevents unauthorized access
CREATE POLICY "Users can update own usage" 
    ON usage_limits FOR UPDATE 
    USING (auth.uid() = user_id);
```

### Authentication
- ✅ Email verification (optional)
- ✅ Password strength requirements
- ✅ Secure session management
- ✅ OAuth providers (Google, GitHub)

## 📈 Analytics & Monitoring

### Track in Supabase Dashboard:
1. **User Growth**
   - New signups
   - Active users
   - Guest conversions

2. **Usage Metrics**
   - Total transformations
   - Average per user
   - Tier distribution

3. **Revenue (with Stripe)**
   - MRR (Monthly Recurring Revenue)
   - Upgrades
   - Churns

## 🔮 Future Enhancements

### Phase 1: Stripe Integration
```javascript
// Create checkout session
const stripe = Stripe(CONFIG.STRIPE.PUBLISHABLE_KEY);
stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    successUrl: window.location.origin + '/success',
    cancelUrl: window.location.origin + '/auth.html'
});
```

### Phase 2: User Dashboard
```html
<div class="dashboard">
    <div class="stats-grid">
        <div class="stat-card">
            <h3>Transformations This Month</h3>
            <div class="value">23/100</div>
        </div>
        <div class="stat-card">
            <h3>Total Saved</h3>
            <div class="value">$247</div>
        </div>
    </div>
    <div class="history">
        <!-- Recent transformations -->
    </div>
</div>
```

### Phase 3: API Access
```javascript
// For Pro/Pro+ users
const apiKey = generateApiKey(userId);
// Users can use API directly
fetch('https://api.texthumanizer.com/transform', {
    headers: { 'X-API-Key': apiKey }
});
```

## 🐛 Troubleshooting

### Issue: "Can't sign up"
- ✅ Check Supabase email provider enabled
- ✅ Check config.js has correct keys
- ✅ Check browser console for errors

### Issue: "Usage not tracking"
- ✅ Verify user is signed in
- ✅ Check RLS policies
- ✅ Check browser console

### Issue: "Redirect not working"
- ✅ Check Supabase URL configuration
- ✅ Verify redirect URLs match exactly
- ✅ Clear browser cache

## 📞 Support

- **Supabase**: https://discord.supabase.com
- **Stripe**: https://support.stripe.com
- **Project Issues**: https://github.com/AliMehdi512/AI-Text-Humanizer-App/issues

## ✅ Checklist

Before deploying:
- [ ] Supabase project created
- [ ] Database schema deployed
- [ ] Authentication configured
- [ ] config.js updated
- [ ] auth.html updated
- [ ] Tested locally
- [ ] Tested guest mode
- [ ] Tested signup/signin
- [ ] Tested usage tracking
- [ ] Tested upgrade modal
- [ ] Ready to deploy!

---

**Your AI Text Humanizer is now enterprise-ready with a complete authentication and subscription system!** 🚀

