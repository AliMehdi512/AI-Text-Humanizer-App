# 🚀 Stripe Payment Integration Setup Guide

## Overview
This guide will help you set up Stripe payments for your AI Text Humanizer app. Currently, the app shows a demo message when users try to upgrade. Follow these steps to enable real payments.

## Step 1: Create Stripe Account

1. **Go to Stripe**: Visit [https://stripe.com](https://stripe.com)
2. **Sign Up**: Create a free Stripe account
3. **Complete Verification**: Verify your business details
4. **Get API Keys**: Navigate to Developers > API Keys

## Step 2: Get Your Stripe Keys

### Test Mode (Development)
- **Publishable Key**: `pk_test_...` (starts with pk_test_)
- **Secret Key**: `sk_test_...` (starts with sk_test_)

### Live Mode (Production)
- **Publishable Key**: `pk_live_...` (starts with pk_live_)
- **Secret Key**: `sk_live_...` (starts with sk_live_)

## Step 3: Update Configuration

### Update `config.js`
```javascript
// Add Stripe configuration
STRIPE: {
    PUBLISHABLE_KEY: 'pk_test_your_publishable_key_here',
    SECRET_KEY: 'sk_test_your_secret_key_here', // Keep this secure!
    WEBHOOK_SECRET: 'whsec_your_webhook_secret_here'
}
```

### Example:
```javascript
const CONFIG = {
    // ... existing config ...
    
    STRIPE: {
        PUBLISHABLE_KEY: 'pk_test_51ABC123...',
        SECRET_KEY: 'sk_test_51ABC123...',
        WEBHOOK_SECRET: 'whsec_1234567890...'
    }
};
```

## Step 4: Create Products in Stripe Dashboard

1. **Go to Products**: In Stripe Dashboard > Products
2. **Create Products**:
   - **Free Plan**: $0/month (already exists)
   - **Pro Plan**: $9.99/month
   - **Pro+ Plan**: $29.99/month

3. **Get Price IDs**: Copy the price IDs (e.g., `price_1234567890`)

## Step 5: Update Subscription Tiers

### Update `config.js` with Stripe Price IDs:
```javascript
SUBSCRIPTION_TIERS: {
    guest: {
        name: 'Guest',
        price: 0,
        limit: 1,
        features: ['1 free trial']
    },
    free: {
        name: 'Free',
        price: 0,
        limit: 5,
        priceId: null, // No Stripe price for free
        features: ['5 transformations/month', 'Basic features', 'Email support']
    },
    pro: {
        name: 'Pro',
        price: 9.99,
        limit: 100,
        priceId: 'price_1234567890', // Your Stripe Pro price ID
        features: ['100 transformations/month', 'Advanced features', 'Priority support', 'API access']
    },
    pro_plus: {
        name: 'Pro+',
        price: 29.99,
        limit: 500,
        priceId: 'price_0987654321', // Your Stripe Pro+ price ID
        features: ['500 transformations/month', 'All features', '24/7 support', 'API access', 'Custom integrations']
    }
}
```

## Step 6: Set Up Webhooks

1. **Go to Webhooks**: Stripe Dashboard > Developers > Webhooks
2. **Add Endpoint**: `https://your-domain.com/api/webhook`
3. **Select Events**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. **Get Webhook Secret**: Copy the webhook signing secret

## Step 7: Backend API Integration

### Update your FastAPI backend (`app.py`):

```python
import stripe
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Initialize Stripe
stripe.api_key = "sk_test_your_secret_key_here"

class CheckoutRequest(BaseModel):
    price_id: str
    user_id: str

@app.post("/api/create-checkout-session")
async def create_checkout_session(request: CheckoutRequest):
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': request.price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url='https://your-domain.com/success',
            cancel_url='https://your-domain.com/cancel',
            metadata={
                'user_id': request.user_id
            }
        )
        return {"checkout_url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, "whsec_your_webhook_secret"
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # Update user subscription in database
        user_id = session['metadata']['user_id']
        # Update user tier in Supabase
        
    return {"status": "success"}
```

## Step 8: Frontend Integration

### Update `auth-integration.js`:

```javascript
async function handleUpgrade(tier) {
    const tierInfo = CONFIG.SUBSCRIPTION_TIERS[tier];
    
    if (!tierInfo.priceId) {
        alert('This tier is not available for purchase.');
        return;
    }
    
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                price_id: tierInfo.priceId,
                user_id: currentUser.id
            })
        });
        
        const data = await response.json();
        if (data.checkout_url) {
            window.location.href = data.checkout_url;
        }
    } catch (error) {
        console.error('Error creating checkout session:', error);
        alert('Error processing payment. Please try again.');
    }
}
```

## Step 9: Test the Integration

### Test Mode:
1. Use test API keys
2. Use test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
3. Use any future expiry date and any 3-digit CVC

### Test Flow:
1. User clicks "Upgrade Now"
2. Redirected to Stripe Checkout
3. Completes payment
4. Webhook updates user tier
5. User gets upgraded features

## Step 10: Go Live

1. **Switch to Live Keys**: Update config.js with live API keys
2. **Update Webhook URL**: Point to production domain
3. **Test with Real Cards**: Use real payment methods
4. **Monitor**: Check Stripe Dashboard for transactions

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never expose secret keys** in frontend code
2. **Use environment variables** for sensitive data
3. **Validate webhook signatures** on backend
4. **Use HTTPS** in production
5. **Implement rate limiting** on API endpoints

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure your API allows requests from your domain
2. **Webhook Failures**: Check webhook URL is accessible
3. **Price ID Errors**: Verify price IDs exist in Stripe
4. **Authentication Issues**: Ensure user is logged in before checkout

### Debug Mode:
- Enable Stripe test mode for development
- Check browser console for errors
- Monitor Stripe Dashboard for webhook events

## Support

- **Stripe Documentation**: [https://stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: Available in your Stripe Dashboard
- **Community**: [Stripe Community Forum](https://support.stripe.com/)

---

## Quick Start Checklist

- [ ] Create Stripe account
- [ ] Get API keys (test mode)
- [ ] Update config.js with keys
- [ ] Create products in Stripe Dashboard
- [ ] Get price IDs
- [ ] Update subscription tiers with price IDs
- [ ] Set up webhook endpoint
- [ ] Update backend API
- [ ] Update frontend integration
- [ ] Test with test cards
- [ ] Deploy to production
- [ ] Switch to live keys

Once you complete these steps, your AI Text Humanizer will have full payment processing capabilities! 🚀
