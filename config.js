// =====================================================
// Configuration File
// =====================================================

// Supabase Configuration
const CONFIG = {
    SUPABASE: {
        URL: 'https://tuurlnxzqkjzasldymtv.supabase.co', // e.g., 'https://xxxxx.supabase.co'
        ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dXJsbnh6cWtqemFzbGR5bXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMDcwNDQsImV4cCI6MjA3NTg4MzA0NH0.4NWDQ1dqd9h7d87wqST05D3PL06fJc581Nd6WyvHsbI' // Your Supabase anon/public key
    },
    
    API: {
        BASE_URL: 'https://ali578-humanizer-api.hf.space'
    },
    
    SUBSCRIPTION_TIERS: {
        guest: {
            name: 'Guest',
            limit: 1,
            price: 0,
            features: ['1 free trial', 'No signup required']
        },
        free: {
            name: 'Free',
            limit: 5,
            price: 0,
            features: ['5 transformations/month', 'Basic features', 'Email support']
        },
        pro: {
            name: 'Pro',
            limit: 100,
            price: 9.99,
            features: ['100 transformations/month', 'Advanced features', 'Priority support', 'API access']
        },
        pro_plus: {
            name: 'Pro+',
            limit: 500,
            price: 29.99,
            features: ['500 transformations/month', 'All features', '24/7 support', 'API access', 'Custom integrations']
        }
    },
    
    STRIPE: {
        PUBLISHABLE_KEY: 'pk_test_51SHxnv6GvTaf3o2CxKhamTSMnWzvf2nGw4zAZrpcCyMh9a5c2cfKU1a9DqHBl1Z9ft9e4hEGu4FzWPbSPZkdV4ho00WceaMvBL', // Get from Stripe Dashboard -> Developers -> API Keys
        // ⚠️ NOTE: SECRET_KEY should NEVER be in frontend code! It belongs in backend only.
        PRO_PRICE_ID: 'price_1SHxvL6GvTaf3o2C6d6x3yUu', // Lookup key or Price ID from your Stripe product
        PRO_PLUS_PRICE_ID: 'price_1SHxwX6GvTaf3o2COkiBHVz9', // Lookup key or Price ID from your Stripe product
        CHECKOUT_SUCCESS_URL: window.location.origin + '/AI-Text-Humanizer-App/stripe-success.html',
        CHECKOUT_CANCEL_URL: window.location.origin + '/AI-Text-Humanizer-App/stripe-cancel.html'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

