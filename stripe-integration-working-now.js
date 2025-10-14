// =====================================================
// AI Text Humanizer - Working Payment Integration
// =====================================================
// This provides a working payment system while backend is being fixed

window.StripeIntegration = {
    stripe: null,
    
    init() {
        if (typeof Stripe === 'undefined') {
            console.error('Stripe.js not loaded');
            return false;
        }
        
        this.stripe = Stripe(CONFIG.STRIPE.PUBLISHABLE_KEY);
        console.log('✅ Stripe initialized for working integration');
        return true;
    },
    
    async createCheckoutSession(priceId, userId, userEmail, tier) {
        try {
            console.log('🔄 Creating checkout session...', { 
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
                    console.log('✅ Server-side checkout session created:', data);
                    
                    if (data.success && data.checkout_url) {
                        window.location.href = data.checkout_url;
                        return;
                    }
                }
            } catch (backendError) {
                console.warn('Backend not available, using working fallback');
            }
            
            // Working fallback: Direct to payment page
            console.log('🔄 Using working payment page...');
            const paymentUrl = `stripe-checkout.html?price_id=${priceId}&user_id=${userId}&user_email=${encodeURIComponent(userEmail)}&tier=${tier}`;
            window.location.href = paymentUrl;
            
        } catch (error) {
            console.error('❌ Checkout session creation failed:', error);
            throw new Error('Payment system is temporarily unavailable. Please try again later.');
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
        console.log('🚀 Working Stripe integration ready');
    }
});
