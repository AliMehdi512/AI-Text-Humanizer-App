// =====================================================
// AI Text Humanizer - Hybrid Stripe Integration
// =====================================================
// This file handles both backend and fallback Stripe payments

window.StripeIntegration = {
    // Initialize Stripe with publishable key
    stripe: null,
    
    init() {
        if (typeof Stripe === 'undefined') {
            console.error('Stripe.js not loaded');
            return false;
        }
        
        this.stripe = Stripe(CONFIG.STRIPE.PUBLISHABLE_KEY);
        console.log('✅ Stripe initialized with hybrid integration');
        return true;
    },
    
    // Create checkout session with fallback
    async createCheckoutSession(priceId, userId, userEmail, tier) {
        try {
            console.log('🔄 Creating checkout session...', {
                priceId,
                userId,
                userEmail,
                tier
            });
            
            // Try backend API first
            try {
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
                    console.log('✅ Backend checkout session created:', data);
                    
                    if (data.success && data.checkout_url) {
                        window.location.href = data.checkout_url;
                        return;
                    }
                }
            } catch (backendError) {
                console.warn('⚠️ Backend API not available, using fallback:', backendError.message);
            }
            
            // Fallback: Direct Stripe checkout
            console.log('🔄 Using direct Stripe checkout fallback...');
            await this.createDirectCheckout(priceId, userId, userEmail, tier);
            
        } catch (error) {
            console.error('❌ Checkout session creation failed:', error);
            throw error;
        }
    },
    
    // Direct Stripe checkout (fallback method)
    async createDirectCheckout(priceId, userId, userEmail, tier) {
        try {
            const { error } = await this.stripe.redirectToCheckout({
                lineItems: [{
                    price: priceId,
                    quantity: 1,
                }],
                mode: 'payment',
                successUrl: `https://alimehdi512.github.io/AI-Text-Humanizer-App/payment-success.html?tier=${tier}&amount=${this.getAmountFromTier(tier)}`,
                cancelUrl: 'https://alimehdi512.github.io/AI-Text-Humanizer-App/stripe-cancel.html',
                customerEmail: userEmail,
                metadata: {
                    user_id: userId,
                    tier: tier
                }
            });
            
            if (error) {
                throw new Error(error.message);
            }
            
        } catch (error) {
            console.error('❌ Direct checkout failed:', error);
            throw error;
        }
    },
    
    // Get amount from tier (for fallback)
    getAmountFromTier(tier) {
        const amounts = {
            'pro': '9.99',
            'pro_plus': '29.99'
        };
        return amounts[tier] || '9.99';
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
        console.log('🚀 Stripe hybrid integration ready');
    } else {
        console.error('❌ Failed to initialize Stripe hybrid integration');
    }
});
