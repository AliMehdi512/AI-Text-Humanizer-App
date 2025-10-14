// =====================================================
// AI Text Humanizer - Real Stripe Integration (Backend)
// =====================================================
// This file handles real Stripe payments through the backend API

window.StripeIntegration = {
    // Initialize Stripe with publishable key
    stripe: null,
    
    init() {
        if (typeof Stripe === 'undefined') {
            console.error('Stripe.js not loaded');
            return false;
        }
        
        this.stripe = Stripe(CONFIG.STRIPE.PUBLISHABLE_KEY);
        console.log('✅ Stripe initialized with backend integration');
        return true;
    },
    
    // Create checkout session via backend API
    async createCheckoutSession(priceId, userId, userEmail, tier) {
        try {
            console.log('🔄 Creating checkout session via backend...', {
                priceId,
                userId,
                userEmail,
                tier
            });
            
            const response = await fetch(`${CONFIG.API.BASE_URL}/api/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    price_id: priceId,
                    user_id: userId,
                    user_email: userEmail,
                    tier: tier
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Checkout session created:', data);
            
            if (data.success && data.checkout_url) {
                // Redirect to Stripe Checkout
                window.location.href = data.checkout_url;
            } else {
                throw new Error('Invalid response from server');
            }
            
        } catch (error) {
            console.error('❌ Checkout session creation failed:', error);
            throw error;
        }
    },
    
    // Get price ID from tier name
    getPriceIdFromTier(tier) {
        const priceMap = {
            'pro': CONFIG.STRIPE.PRO_PRICE_ID,
            'pro_plus': CONFIG.STRIPE.PRO_PLUS_PRICE_ID
        };
        
        const priceId = priceMap[tier];
        if (!priceId) {
            throw new Error(`No price ID found for tier: ${tier}`);
        }
        
        return priceId;
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.StripeIntegration.init()) {
        console.log('🚀 Stripe backend integration ready');
    } else {
        console.error('❌ Failed to initialize Stripe backend integration');
    }
});
