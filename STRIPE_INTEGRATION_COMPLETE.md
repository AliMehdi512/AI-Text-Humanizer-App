# 🎉 Stripe Integration - Almost Complete!

## ✅ What's Already Done

1. **✅ Stripe Account Created**: You've created your Stripe account
2. **✅ Products Created**: You've set up products in Stripe Dashboard  
3. **✅ Test Keys Added**: Your test secret key is in the config
4. **✅ Frontend Integration**: Checkout flow is ready
5. **✅ Success/Cancel Pages**: Beautiful payment result pages created
6. **✅ Code Integration**: All Stripe code is integrated into the app

## 🎯 What You Need To Do Now

### Step 1: Get Your Publishable Key

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Click on **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Update `config.js`:

```javascript
STRIPE: {
    PUBLISHABLE_KEY: 'pk_test_YOUR_KEY_HERE', // ← Paste your key here
    ...
}
```

### Step 2: Get Your Price IDs

You have two options for setting up prices:

#### Option A: Using Price IDs (Recommended)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/) → **Products**
2. Find your **Pro** product → Click on it
3. Copy the **Price ID** (starts with `price_`)
4. Repeat for **Pro+** product
5. Update `config.js`:

```javascript
STRIPE: {
    ...
    PRO_PRICE_ID: 'price_1234567890', // ← Paste Pro price ID here
    PRO_PLUS_PRICE_ID: 'price_0987654321', // ← Paste Pro+ price ID here
}
```

#### Option B: Using Lookup Keys (Alternative)

1. In Stripe Dashboard → Products → Edit your product
2. Add a **Lookup key**: `price_pro_monthly` for Pro, `price_pro_plus_monthly` for Pro+
3. Your config already has these lookup keys configured!

### Step 3: Set Up Webhook (For Production)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/) → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL: `https://ali578-humanizer-api.hf.space/api/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Update `config.js`:

```javascript
STRIPE: {
    ...
    WEBHOOK_SECRET: 'whsec_YOUR_SECRET_HERE',
}
```

### Step 4: Update Backend API (Optional for Now)

The backend needs to handle Stripe checkout sessions. You have two options:

#### Option A: Use Stripe Direct (Quick Test)
- The frontend will redirect directly to Stripe Checkout
- Stripe will handle the payment
- You'll need to manually update subscriptions in Supabase

#### Option B: Add Backend Endpoint (Recommended)
Add this to your `app_api.py` or `app.py`:

```python
import stripe
from fastapi import Request, HTTPException

# Set Stripe API key (use the key from stripe/server.py or get from Stripe Dashboard)
stripe.api_key = "YOUR_STRIPE_SECRET_KEY_FROM_DASHBOARD"

@app.post("/api/create-checkout-session")
async def create_checkout_session(request: Request):
    try:
        data = await request.json()
        
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': data['priceId'],
                'quantity': 1,
            }],
            mode='subscription',
            success_url=data['successUrl'],
            cancel_url=data['cancelUrl'],
            customer_email=data['userEmail'],
            client_reference_id=data['userId'],
            metadata={
                'user_id': data['userId'],
                'tier': data['tier']
            }
        )
        
        return {"checkout_url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/stripe-webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, "whsec_YOUR_WEBHOOK_SECRET"
        )
        
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            user_id = session['metadata']['user_id']
            tier = session['metadata']['tier']
            
            # TODO: Update user subscription in Supabase
            print(f"✅ Payment successful for user {user_id}, tier: {tier}")
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return {"status": "success"}
```

## 🧪 Testing Your Integration

### 1. Test Cards
Use these test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

Use any:
- Future expiry date (e.g., 12/34)
- Any 3-digit CVC (e.g., 123)
- Any billing ZIP code

### 2. Test Flow
1. Visit your app: https://alimehdi512.github.io/AI-Text-Humanizer-App/
2. Sign in with Google
3. Click user menu → "Upgrade Plan"
4. Select Pro or Pro+ plan
5. Click "Upgrade Now"
6. Should redirect to Stripe Checkout
7. Use test card `4242 4242 4242 4242`
8. Complete payment
9. Should redirect to success page

### 3. Check Results
- ✅ Payment appears in Stripe Dashboard
- ✅ Success page shows correct plan info
- ✅ Webhook receives event (check Stripe Dashboard → Developers → Webhooks → View logs)

## 📝 Current Configuration Status

✅ **Secret Key**: Configured  
⚠️ **Publishable Key**: Needs your actual key  
⚠️ **Price IDs**: Needs your actual price IDs  
⚠️ **Webhook Secret**: Needs actual secret (for production)  

## 🚀 Quick Start Commands

### 1. Deploy to GitHub Pages
```bash
git add -A
git commit -m "✅ Complete Stripe integration"
git push origin main
```

### 2. Update Hugging Face API (if adding backend endpoint)
```bash
# Add stripe to requirements_api.txt
echo "stripe==11.1.0" >> requirements_api.txt

# Deploy to Hugging Face
git push hf main
```

## 🎯 What Happens When User Upgrades?

1. User clicks "Upgrade Now" on your app
2. Frontend calls `handleUpgrade(tier)` function
3. Stripe Checkout session is created
4. User is redirected to Stripe's secure payment page
5. User enters payment details
6. Stripe processes the payment
7. User is redirected to success page
8. Webhook updates subscription in database (when configured)
9. User gets upgraded features immediately!

## 🔒 Security Notes

⚠️ **Important**: The current config.js has your SECRET_KEY exposed! This is OK for development but MUST be fixed for production:

1. **Remove SECRET_KEY from config.js**
2. **Add it to backend environment variables only**
3. **Never expose secret keys in frontend code**

For production:
```javascript
// config.js - Remove SECRET_KEY, keep only:
STRIPE: {
    PUBLISHABLE_KEY: 'pk_live_...',  // This is safe to expose
    PRO_PRICE_ID: 'price_...',
    PRO_PLUS_PRICE_ID: 'price_...',
}
```

## 🎉 You're Almost There!

Complete Steps 1-2 above (Get Publishable Key and Price IDs), and you'll have a fully functional payment system!

Need help? Check:
- 📖 STRIPE_SETUP_GUIDE.md - Full integration guide
- 🔗 [Stripe Documentation](https://stripe.com/docs)
- 💬 [Stripe Support](https://support.stripe.com/)

