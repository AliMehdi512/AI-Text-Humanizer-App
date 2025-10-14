// =====================================================
// AI Text Humanizer - Server-Side Only Stripe Integration
// =====================================================
// This integration works entirely through server-side API calls

window.StripeIntegration = {
    stripe: null,
    
    init() {
        if (typeof Stripe === 'undefined') {
            console.error('Stripe.js not loaded');
            return false;
        }
        
        this.stripe = Stripe(CONFIG.STRIPE.PUBLISHABLE_KEY);
        console.log('✅ Stripe initialized for server-side integration');
        return true;
    },
    
    async createCheckoutSession(priceId, userId, userEmail, tier) {
        try {
            console.log('🔄 Creating server-side checkout session...', { 
                priceId, userId, userEmail, tier 
            });
            
            // Try backend API first (server-side integration)
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
                        // Redirect to Stripe's hosted checkout page
                        window.location.href = data.checkout_url;
                        return;
                    }
                } else {
                    console.warn('Backend API not ready yet, status:', response.status);
                }
            } catch (backendError) {
                console.warn('Backend API not available:', backendError.message);
            }
            
            // If backend is not available, show informative message
            console.log('🔄 Backend not available, showing setup message...');
            throw new Error('Server-side payment system is being set up. Please try again in a few minutes. The backend API is not yet available.');
            
        } catch (error) {
            console.error('❌ Server-side checkout failed:', error);
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
        console.log('🚀 Server-side Stripe integration ready');
    }
});
