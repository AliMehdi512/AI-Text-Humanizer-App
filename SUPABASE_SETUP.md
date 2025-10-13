# 🚀 Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Fill in:
   - **Name**: ai-text-humanizer
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier (perfect for getting started)
6. Click "Create new project"
7. Wait 2-3 minutes for setup

## Step 2: Run Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the SQL Editor
5. Click "Run" or press `Ctrl+Enter`
6. You should see "Success. No rows returned"

### Verify Tables Created:
- Go to **Table Editor** (left sidebar)
- You should see these tables:
  - `user_profiles`
  - `usage_limits`
  - `subscriptions`
  - `guest_usage`
  - `transaction_history`
  - `subscription_tiers`

## Step 3: Configure Authentication

1. Go to **Authentication** > **Providers** (left sidebar)
2. **Enable Email Provider**:
   - Toggle "Enable Email provider" ON
   - Toggle "Confirm email" ON (recommended)
   - Toggle "Secure email change" ON
   - Click "Save"

3. **Enable Google OAuth** (optional):
   - Scroll to "Google"
   - Toggle "Enable Google" ON
   - You'll need:
     - Google Client ID
     - Google Client Secret
   - Get these from [Google Cloud Console](https://console.cloud.google.com)
   - Follow Supabase's guide for setup
   - Click "Save"

4. **Enable GitHub OAuth** (optional):
   - Scroll to "GitHub"
   - Toggle "Enable GitHub" ON
   - You'll need:
     - GitHub Client ID
     - GitHub Client Secret
   - Get these from [GitHub Developer Settings](https://github.com/settings/developers)
   - Follow Supabase's guide for setup
   - Click "Save"

## Step 4: Get API Keys

1. Go to **Settings** > **API** (left sidebar)
2. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: (keep this secret!)

3. Copy these values - you'll need them!

## Step 5: Configure Your App

### Update `config.js`:

```javascript
const CONFIG = {
    SUPABASE: {
        URL: 'https://YOUR_PROJECT_ID.supabase.co', // Paste your Project URL
        ANON_KEY: 'YOUR_ANON_KEY' // Paste your anon/public key
    },
    // ... rest of config
};
```

### Update `auth.html`:

Replace these lines:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

With your actual values:
```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

## Step 6: Configure URL Redirects

1. Go to **Authentication** > **URL Configuration**
2. Set **Site URL**: `https://alimehdi512.github.io/AI-Text-Humanizer-App/`
3. Add **Redirect URLs**:
   ```
   https://alimehdi512.github.io/AI-Text-Humanizer-App/
   https://alimehdi512.github.io/AI-Text-Humanizer-App/index.html
   http://localhost:3000
   http://localhost:8080
   http://127.0.0.1:3000
   http://127.0.0.1:8080
   ```
4. Click "Save"

## Step 7: Test Authentication

### Local Testing:
1. Update `config.js` and `auth.html` with your credentials
2. Open `auth.html` in browser
3. Try:
   - Sign up with email
   - Check your email for verification
   - Sign in
   - Try social login (if configured)
   - Try guest mode

### Check Database:
1. Go to **Table Editor** > **user_profiles**
2. You should see your test user

## Step 8: Row Level Security (RLS)

RLS is already configured in the SQL schema! It ensures:
- Users can only see their own data
- Users can't access other users' profiles
- Users can't modify others' usage limits

### Verify RLS:
1. Go to **Authentication** > **Policies**
2. Each table should have policies listed
3. Example policies:
   - "Users can view own profile"
   - "Users can update own profile"
   - etc.

## Step 9: Monitor Usage

### Real-time Monitoring:
1. Go to **Database** > **Tables** > `usage_limits`
2. Watch as users transform text
3. See `tries_used` increment

### Check Logs:
1. Go to **Logs** (left sidebar)
2. Monitor:
   - Auth logs
   - Database logs
   - API logs

## Step 10: Subscription Tiers Data

Verify subscription tiers table:
1. Go to **Table Editor** > **subscription_tiers**
2. You should see 4 rows:
   - guest: 1 try, $0
   - free: 5 tries, $0
   - pro: 100 tries, $9.99/mo
   - pro_plus: 500 tries, $29.99/mo

## 🎉 Setup Complete!

Your Supabase backend is now ready! 

### Next Steps:
1. ✅ Update frontend with Supabase credentials
2. ✅ Test authentication flow
3. ✅ Integrate with existing app
4. ✅ Set up Stripe for payments (optional)
5. ✅ Deploy to GitHub Pages

### Useful Links:
- **Supabase Dashboard**: https://app.supabase.com
- **Supabase Docs**: https://supabase.com/docs
- **Authentication Guide**: https://supabase.com/docs/guides/auth
- **Database Guide**: https://supabase.com/docs/guides/database

### Support:
- Supabase Discord: https://discord.supabase.com
- GitHub Discussions: https://github.com/supabase/supabase/discussions

## Troubleshooting

### Issue: Can't create account
- Check email provider is enabled
- Check redirect URLs are configured
- Check browser console for errors

### Issue: RLS blocking queries
- Verify you're signed in
- Check RLS policies in SQL Editor
- Test with service_role key (for debugging only!)

### Issue: Social login not working
- Verify OAuth credentials
- Check redirect URLs match exactly
- Ensure OAuth apps are configured correctly

### Issue: Usage not incrementing
- Check user_id matches auth.uid()
- Verify RLS policies allow INSERT/UPDATE
- Check browser console for errors

