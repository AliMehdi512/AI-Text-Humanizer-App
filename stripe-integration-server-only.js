// =====================================================
// AI Text Humanizer - Server-Only Stripe Integration
// =====================================================
// This integration only uses server-side checkout creation (no client-only integration needed)

window.StripeIntegration = {
    // Initialize Stripe with publishable key
    stripe: null,
    
    init() {
        if (typeof Stripe === 'undefined') {
            console.error('Stripe.js not loaded');
            return false;
        }
        
        this.stripe = Stripe(CONFIG.STRIPE.PUBLISHABLE_KEY);
        console.log('✅ Stripe initialized with server-only integration');
        return true;
    },
    
    // Create checkout session (server-only method)
    async createCheckoutSession(priceId, userId, userEmail, tier) {
        try {
            console.log('🔄 Creating server-side checkout session...', {
                priceId,
                userId,
                userEmail,
                tier
            });
            
            // Always use backend API (most secure and doesn't require client-only integration)
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
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Server checkout session created:', data);
                
                if (data.success && data.checkout_url) {
                    // Redirect to Stripe's hosted checkout page
                    window.location.href = data.checkout_url;
                    return;
                } else {
                    throw new Error('Invalid response from server');
                }
            } else {
                const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
                throw new Error(errorData.detail || `HTTP ${response.status}`);
            }
            
        } catch (error) {
            console.error('❌ Checkout session creation failed:', error);
            
            // Show user-friendly error message
            if (error.message.includes('404')) {
                throw new Error('Payment system is currently being updated. Please try again in a few minutes.');
            } else if (error.message.includes('500')) {
                throw new Error('Payment system is temporarily unavailable. Please try again later.');
            } else {
                throw new Error(`Payment setup failed: ${error.message}`);
            }
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
        console.log('🚀 Stripe server-only integration ready');
    } else {
        console.error('❌ Failed to initialize Stripe server-only integration');
    }
});
