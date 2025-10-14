// =====================================================
// AI Text Humanizer - Final Working Stripe Integration
// =====================================================

window.StripeIntegration = {
    stripe: null,
    
    init() {
        if (typeof Stripe === 'undefined') {
            console.error('Stripe.js not loaded');
            return false;
        }
        
        this.stripe = Stripe(CONFIG.STRIPE.PUBLISHABLE_KEY);
        console.log('✅ Stripe initialized');
        return true;
    },
    
    async createCheckoutSession(priceId, userId, userEmail, tier) {
        try {
            console.log('🔄 Creating checkout session...', { priceId, userId, userEmail, tier });
            
            // Try backend first
            try {
                const response = await fetch(`${CONFIG.API.BASE_URL}/api/create-checkout-session`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ price_id: priceId, user_id: userId, user_email: userEmail, tier: tier })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.checkout_url) {
                        window.location.href = data.checkout_url;
                        return;
                    }
                }
            } catch (e) {
                console.warn('Backend not ready, using direct checkout');
            }
            
            // Direct checkout
            const { error } = await this.stripe.redirectToCheckout({
                lineItems: [{ price: priceId, quantity: 1 }],
                mode: 'payment',
                successUrl: `https://alimehdi512.github.io/AI-Text-Humanizer-App/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: 'https://alimehdi512.github.io/AI-Text-Humanizer-App/stripe-cancel.html',
                customerEmail: userEmail,
                clientReferenceId: userId
            });
            
            if (error) {
                if (error.message.includes('client-only integration')) {
                    throw new Error('Please enable client-only integration in Stripe Dashboard: https://dashboard.stripe.com/account/checkout/settings');
                }
                throw new Error(error.message);
            }
            
        } catch (error) {
            console.error('❌ Checkout failed:', error);
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
        console.log('🚀 Stripe integration ready');
    }
});
