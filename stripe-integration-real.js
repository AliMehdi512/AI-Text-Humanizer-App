// =====================================================
// AI Text Humanizer - Real Stripe Integration
// =====================================================
// This creates real Stripe checkout sessions without backend

window.StripeIntegration = {
    stripe: null,
    
    init() {
        if (typeof Stripe === 'undefined') {
            console.error('Stripe.js not loaded');
            return false;
        }
        
        this.stripe = Stripe(CONFIG.STRIPE.PUBLISHABLE_KEY);
        console.log('✅ Stripe initialized for real transactions');
        return true;
    },
    
    async createCheckoutSession(priceId, userId, userEmail, tier) {
        try {
            console.log('🔄 Creating real Stripe checkout session...', { 
                priceId, userId, userEmail, tier 
            });
            
            // Try backend API first
            try {
                const response = await fetch(`${CONFIG.API.BASE_URL}/api/create-checkout-session`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
                        window.location.href = data.checkout_url;
                        return;
                    }
                }
            } catch (backendError) {
                console.warn('Backend not available, using direct Stripe checkout');
            }
            
            // Create real Stripe checkout session using redirectToCheckout
            console.log('🔄 Creating real Stripe checkout session...');
            
            const { error } = await this.stripe.redirectToCheckout({
                lineItems: [{
                    price: priceId,
                    quantity: 1,
                }],
                mode: 'payment',
                successUrl: `https://alimehdi512.github.io/AI-Text-Humanizer-App/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: 'https://alimehdi512.github.io/AI-Text-Humanizer-App/stripe-cancel.html',
                customerEmail: userEmail,
                clientReferenceId: userId
            });
            
            if (error) {
                console.error('Stripe checkout creation failed:', error);
                if (error.message.includes('client-only integration')) {
                    throw new Error('Stripe client-only integration is not enabled. Please enable it in your Stripe Dashboard at https://dashboard.stripe.com/account/checkout/settings');
                }
                throw new Error(`Payment setup failed: ${error.message}`);
            }
            
        } catch (error) {
            console.error('❌ Checkout session creation failed:', error);
            throw error;
        }
    },
    
    getPriceIdFromTier(tier) {
        const priceMap = {
            'pro': CONFIG.STRIPE.PRO_PRICE_ID,
            'pro_plus': CONFIG.STRIPE.PRO_PLUS_PRICE_ID
        };
        const priceId = priceMap[tier];
        if (!priceId) throw new Error(`No price ID for tier: ${tier}`);
        return priceId;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    if (window.StripeIntegration.init()) {
        console.log('🚀 Real Stripe integration ready');
    }
});
