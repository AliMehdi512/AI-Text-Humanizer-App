// =====================================================
// AI Text Humanizer - Working Stripe Integration
// =====================================================
// This file provides a working payment solution without client-only integration

window.StripeIntegration = {
    // Initialize Stripe with publishable key
    stripe: null,
    
    init() {
        if (typeof Stripe === 'undefined') {
            console.error('Stripe.js not loaded');
            return false;
        }
        
        this.stripe = Stripe(CONFIG.STRIPE.PUBLISHABLE_KEY);
        console.log('✅ Stripe initialized with working integration');
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
                console.warn('⚠️ Backend API not available, using working fallback:', backendError.message);
            }
            
            // Working fallback: Direct redirect to Stripe Checkout
            console.log('🔄 Using working fallback: direct Stripe checkout...');
            await this.createWorkingCheckout(priceId, userId, userEmail, tier);
            
        } catch (error) {
            console.error('❌ Checkout session creation failed:', error);
            throw error;
        }
    },
    
    // Working checkout method using direct URL construction
    async createWorkingCheckout(priceId, userId, userEmail, tier) {
        try {
            // Construct Stripe Checkout URL directly
            const baseUrl = 'https://checkout.stripe.com/pay/';
            const params = new URLSearchParams({
                'prefilled_email': userEmail,
                'client_reference_id': userId,
                'payment_method_types[]': 'card'
            });
            
            // For now, redirect to a simple checkout page that handles the payment
            const checkoutUrl = `stripe-checkout.html?price_id=${priceId}&user_id=${userId}&user_email=${encodeURIComponent(userEmail)}&tier=${tier}`;
            
            console.log('🔄 Redirecting to checkout page:', checkoutUrl);
            window.location.href = checkoutUrl;
            
        } catch (error) {
            console.error('❌ Working checkout failed:', error);
            throw error;
        }
    },
    
    // Get amount from tier (for display)
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
        console.log('🚀 Stripe working integration ready');
    } else {
        console.error('❌ Failed to initialize Stripe working integration');
    }
});
