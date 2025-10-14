// =====================================================
// AI Text Humanizer - Temporary Working Integration
// =====================================================
// This provides a working payment flow while backend is being deployed

window.StripeIntegration = {
    // Initialize Stripe with publishable key
    stripe: null,
    
    init() {
        if (typeof Stripe === 'undefined') {
            console.error('Stripe.js not loaded');
            return false;
        }
        
        this.stripe = Stripe(CONFIG.STRIPE.PUBLISHABLE_KEY);
        console.log('✅ Stripe initialized with temporary integration');
        return true;
    },
    
    // Create checkout session with working fallback
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
                console.warn('⚠️ Backend not ready yet, using temporary solution:', backendError.message);
            }
            
            // Temporary working solution: Direct checkout page
            console.log('🔄 Using temporary checkout solution...');
            const checkoutUrl = `stripe-checkout.html?price_id=${priceId}&user_id=${userId}&user_email=${encodeURIComponent(userEmail)}&tier=${tier}`;
            window.location.href = checkoutUrl;
            
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
        console.log('🚀 Stripe temporary integration ready');
    } else {
        console.error('❌ Failed to initialize Stripe temporary integration');
    }
});
