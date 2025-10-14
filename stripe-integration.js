// =====================================================
// Stripe Payment Integration
// =====================================================

// Initialize Stripe
let stripe;
if (typeof Stripe !== 'undefined' && CONFIG.STRIPE.PUBLISHABLE_KEY) {
    stripe = Stripe(CONFIG.STRIPE.PUBLISHABLE_KEY);
}

/**
 * Create a Stripe Checkout Session
 * @param {string} priceId - The Stripe Price ID or lookup key
 * @param {string} userId - The user's ID
 * @param {string} userEmail - The user's email
 * @param {string} tier - The subscription tier (pro, pro_plus)
 * @returns {Promise} - Redirects to Stripe Checkout
 */
async function createCheckoutSession(priceId, userId, userEmail, tier) {
    try {
        // Show loading state
        const loadingToast = showLoadingToast('Redirecting to secure checkout...');

        // Prepare checkout data
        const checkoutData = {
            priceId: priceId,
            userId: userId,
            userEmail: userEmail,
            tier: tier,
            successUrl: CONFIG.STRIPE.CHECKOUT_SUCCESS_URL + '?session_id={CHECKOUT_SESSION_ID}',
            cancelUrl: CONFIG.STRIPE.CHECKOUT_CANCEL_URL
        };

        // Call backend API to create checkout session
        const response = await fetch(`${CONFIG.API.BASE_URL}/api/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(checkoutData)
        });

        if (!response.ok) {
            throw new Error('Failed to create checkout session');
        }

        const session = await response.json();

        // Hide loading toast
        hideLoadingToast(loadingToast);

        // Redirect to Stripe Checkout
        if (session.checkout_url) {
            window.location.href = session.checkout_url;
        } else if (stripe && session.sessionId) {
            // Alternative: Use Stripe.js redirectToCheckout
            const { error } = await stripe.redirectToCheckout({
                sessionId: session.sessionId
            });

            if (error) {
                throw new Error(error.message);
            }
        } else {
            throw new Error('No checkout URL received');
        }

    } catch (error) {
        console.error('Checkout error:', error);
        alert(`Error creating checkout session: ${error.message}\n\nPlease try again or contact support.`);
    }
}

/**
 * Open Stripe Customer Portal for subscription management
 * @param {string} customerId - The Stripe customer ID
 * @returns {Promise} - Redirects to Stripe Customer Portal
 */
async function openCustomerPortal(customerId) {
    try {
        const loadingToast = showLoadingToast('Opening billing portal...');

        const response = await fetch(`${CONFIG.API.BASE_URL}/api/create-portal-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerId: customerId,
                returnUrl: window.location.origin + '/index.html'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create portal session');
        }

        const session = await response.json();

        hideLoadingToast(loadingToast);

        if (session.portal_url) {
            window.location.href = session.portal_url;
        } else {
            throw new Error('No portal URL received');
        }

    } catch (error) {
        console.error('Portal error:', error);
        alert(`Error opening billing portal: ${error.message}\n\nPlease try again or contact support.`);
    }
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
 * Verify Stripe webhook signature (backend only)
 * This function should be called on the backend
 */
function verifyWebhookSignature(payload, signature, secret) {
    // This is handled by the backend
    // Included here for reference
    return stripe.webhooks.constructEvent(payload, signature, secret);
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
        openCustomerPortal,
        getPriceIdFromTier
    };
}

// For Node.js/backend use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createCheckoutSession,
        openCustomerPortal,
        verifyWebhookSignature,
        getPriceIdFromTier
    };
}

