// =====================================================
// AI Text Humanizer - Real Stripe Integration
// Server-side checkout for real card transactions
// =====================================================

window.StripeIntegration = {
    stripe: null,
    
    init() {
        if (typeof Stripe === 'undefined') {
            console.error('❌ Stripe.js not loaded');
            return false;
        }
        
        this.stripe = Stripe(CONFIG.STRIPE.PUBLISHABLE_KEY);
        console.log('✅ Stripe initialized for real transactions');
        return true;
    },
    
    async createCheckoutSession(priceId, userId, userEmail, tier) {
        try {
            console.log('🔄 Creating checkout session...', { 
                priceId, userId, userEmail, tier 
            });
            
            // Call backend API to create checkout session
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
                throw new Error(errorData.detail || 'Failed to create checkout session');
            }
            
            const data = await response.json();
            console.log('✅ Checkout session created:', data);
            
            if (data.success && data.checkout_url) {
                // Redirect to Stripe Checkout
                console.log('🔄 Redirecting to Stripe Checkout...');
                window.location.href = data.checkout_url;
            } else {
                throw new Error('Invalid checkout session response');
            }
            
        } catch (error) {
            console.error('❌ Checkout error:', error);
            throw error;
        }
    },
    
    getPriceIdFromTier(tier) {
        const priceMap = {
            'pro': CONFIG.STRIPE.PRO_PRICE_ID,
            'pro_plus': CONFIG.STRIPE.PRO_PLUS_PRICE_ID
        };
        const priceId = priceMap[tier];
        if (!priceId) {
            throw new Error(`No price ID configured for tier: ${tier}`);
        }
        return priceId;
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (window.StripeIntegration.init()) {
        console.log('🚀 Real Stripe integration ready');
    }
});