# 🚀 Quick Start - Authentication System

## 📋 What's New?

Your AI Text Humanizer now has:
- ✅ Login/Signup pages
- ✅ Guest mode (1 free trial)
- ✅ Usage tracking & limits
- ✅ Subscription tiers (Free: 5, Pro: 100, Pro+: 500)
- ✅ Supabase integration

## ⚡ Quick Setup (5 Minutes)

### 1. Create Supabase Project (2 mins)
```bash
1. Go to https://supabase.com
2. Click "New Project"
3. Name: ai-text-humanizer
4. Wait for setup
```

### 2. Run Database Schema (1 min)
```bash
1. Open Supabase SQL Editor
2. Copy contents of supabase-schema.sql
3. Paste and Run
4. Verify tables created
```

### 3. Get API Keys (30 secs)
```bash
1. Go to Settings > API
2. Copy:
   - Project URL
   - anon/public key
```

### 4. Update Config (1 min)
```javascript
// config.js
SUPABASE: {
    URL: 'https://xxxxx.supabase.co',  // Paste here
    ANON_KEY: 'eyJhbGci...'              // Paste here
}

// auth.html (lines 245-246)
const SUPABASE_URL = 'https://xxxxx.supabase.co';      // Paste here
const SUPABASE_ANON_KEY = 'eyJhbGci...';                // Paste here
```

### 5. Configure URLs (30 secs)
```bash
1. Supabase > Authentication > URL Configuration
2. Site URL: https://alimehdi512.github.io/AI-Text-Humanizer-App/
3. Add Redirect URLs:
   - https://alimehdi512.github.io/AI-Text-Humanizer-App/
   - https://alimehdi512.github.io/AI-Text-Humanizer-App/index.html
```

### 6. Test Locally
```bash
# Open auth.html in browser
# Test:
- Guest mode (1 try)
- Sign up
- Sign in
- Usage tracking
```

### 7. Deploy
```bash
git add .
git commit -m "Add authentication system"
git push origin main
# GitHub Pages auto-deploys!
```

## 🎯 User Flow

### Guest Mode
```
Visit site → Click "Continue as Guest" → Get 1 free trial → See upgrade prompt
```

### New User
```
Visit site → Sign Up → Verify email → Get 5 free tries/month → Use app
```

### Returning User
```
Visit site → Sign In → See usage stats → Continue transforming
```

## 📊 Subscription Tiers

| Tier | Tries | Price |
|------|-------|-------|
| Guest | 1 | $0 |
| Free | 5/mo | $0 |
| Pro | 100/mo | $9.99 |
| Pro+ | 500/mo | $29.99 |

## 🔧 Files Added

```
auth.html              - Login/Signup page
config.js              - Configuration
auth-integration.js    - Auth logic
supabase-schema.sql    - Database schema
SUPABASE_SETUP.md      - Detailed setup guide
AUTHENTICATION_SYSTEM.md - System overview
```

## ✅ Quick Test Checklist

- [ ] Supabase project created
- [ ] Database schema run successfully
- [ ] config.js updated with keys
- [ ] auth.html updated with keys
- [ ] Guest mode works (1 try)
- [ ] Signup works
- [ ] Email verification received
- [ ] Login works
- [ ] Usage tracks correctly
- [ ] Upgrade modal shows
- [ ] Ready to deploy!

## 🐛 Common Issues

**Can't sign up?**
```
1. Check email provider enabled in Supabase
2. Verify config.js has correct keys
3. Check browser console
```

**Usage not tracking?**
```
1. Verify user signed in
2. Check RLS policies in Supabase
3. Check browser console
```

**Redirect failing?**
```
1. Check Supabase URL config
2. Verify URLs match exactly
3. Clear browser cache
```

## 📚 Documentation

- **Full Setup**: SUPABASE_SETUP.md
- **System Overview**: AUTHENTICATION_SYSTEM.md
- **Supabase Docs**: https://supabase.com/docs

## 🎉 You're Ready!

Your AI Text Humanizer now has enterprise-grade authentication! 

**Next Steps:**
1. Set up Supabase (5 mins)
2. Update config files
3. Test locally
4. Deploy to GitHub Pages
5. (Optional) Add Stripe for payments

**Need help?** Check SUPABASE_SETUP.md for detailed instructions.
