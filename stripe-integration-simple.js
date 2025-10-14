// =====================================================
// Simple Stripe Payment Integration (No Backend Required)
// =====================================================

// Initialize Stripe
let stripe;
if (typeof Stripe !== 'undefined' && CONFIG.STRIPE.PUBLISHABLE_KEY) {
    stripe = Stripe(CONFIG.STRIPE.PUBLISHABLE_KEY);
}

/**
 * Create a Stripe Checkout Session using direct approach
 * This works without a backend by using Stripe's hosted checkout
 */
async function createCheckoutSession(priceId, userId, userEmail, tier) {
    try {
        // Show loading state
        const loadingToast = showLoadingToast('Redirecting to secure checkout...');

        // For now, we'll redirect directly to a simple checkout page
        // This is a temporary solution until backend is set up
        const checkoutUrl = createDirectCheckoutUrl(priceId, tier, userEmail);
        
        // Hide loading toast
        hideLoadingToast(loadingToast);

        // Redirect to checkout
        window.location.href = checkoutUrl;

    } catch (error) {
        console.error('Checkout error:', error);
        alert(`Error creating checkout session: ${error.message}\n\nPlease try again or contact support.`);
    }
}

/**
 * Create a direct checkout URL (temporary solution)
 */
function createDirectCheckoutUrl(priceId, tier, userEmail) {
    // This creates a simple checkout page URL
    // In a real implementation, you'd use Stripe's hosted checkout
    const baseUrl = window.location.origin + '/AI-Text-Humanizer-App/';
    const params = new URLSearchParams({
        price_id: priceId,
        tier: tier,
        email: userEmail,
        amount: tier === 'pro' ? '9.99' : '29.99'
    });
    
    return `${baseUrl}stripe-checkout.html?${params.toString()}`;
}

/**
 * Show loading toast notification
 */
function showLoadingToast(message) {
    const toast = document.createElement('div');
    toast.className = 'stripe-loading-toast';
    toast.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10001;
            animation: slideIn 0.3s ease-out;
        ">
            <div style="
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top-color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                animation: spin 1s linear infinite;
            "></div>
            <span>${message}</span>
        </div>
        <style>
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(toast);
    return toast;
}

/**
 * Hide loading toast notification
 */
function hideLoadingToast(toast) {
    if (toast && toast.parentNode) {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

/**
 * Get price ID from tier
 */
function getPriceIdFromTier(tier) {
    switch (tier) {
        case 'pro':
            return CONFIG.STRIPE.PRO_PRICE_ID;
        case 'pro_plus':
            return CONFIG.STRIPE.PRO_PLUS_PRICE_ID;
        default:
            return null;
    }
}

// Export functions
if (typeof window !== 'undefined') {
    window.StripeIntegration = {
        createCheckoutSession,
        getPriceIdFromTier
    };
}
