# 🚀 Render.com Deployment Guide

## Why Render?

- ✅ **Generous Free Tier** - 750 hours/month (enough for 24/7 uptime)
- ✅ **Easy Setup** - Auto-deploy from GitHub
- ✅ **Fast Builds** - Optimized for Python apps
- ✅ **Free SSL** - HTTPS included
- ✅ **No Credit Card Required** - For free tier

---

## 📋 Prerequisites

- ✅ Code pushed to GitHub (DONE!)
- ✅ Render account (we'll create one)

---

## 🚀 Deploy on Render.com (10 Minutes)

### Step 1: Create Render Account (2 minutes)

1. Visit [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access your repositories

### Step 2: Create New Web Service (1 minute)

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - If not connected, click **"Connect GitHub"**
   - Find and select **"AliMehdi512/AI-Text-Humanizer-App"**
4. Click **"Connect"**

### Step 3: Configure Service (2 minutes)

Render will auto-detect settings from `render.yaml`, but verify:

**Basic Settings:**
- **Name**: `ai-text-humanizer` (or your choice)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Runtime**: `Python 3`
- **Build Command**:
  ```bash
  pip install --upgrade pip && pip install -r requirements.txt && python -m spacy download en_core_web_sm && python -c 'import nltk; resources=["punkt","punkt_tab","wordnet","averaged_perceptron_tagger","averaged_perceptron_tagger_eng"]; [nltk.download(r, quiet=True) for r in resources]'
  ```

- **Start Command**:
  ```bash
  streamlit run main.py --server.port=$PORT --server.address=0.0.0.0 --server.headless=true --server.enableCORS=false
  ```

**Plan:**
- Select **"Free"** plan
- 512 MB RAM
- Shared CPU
- Sleeps after 15 min inactivity (wakes up automatically)

### Step 4: Deploy! (5-8 minutes)

1. Click **"Create Web Service"**
2. Render will start building your app
3. Watch the build logs:
   - Installing dependencies
   - Downloading spaCy models
   - Downloading NLTK data
   - Starting Streamlit
4. Wait for **"Live"** status ✅

### Step 5: Get Your App URL

Once deployed:
- Your app URL: `https://ai-text-humanizer.onrender.com`
- Click on the URL to test your app!
- Copy this URL for the next step

---

## 🌐 Update Landing Page with Render URL

Once you have your Render URL, run:

```bash
cd "/home/mehdi/Downloads/other projects/AI-Text-Humanizer-App-main"
./update_railway_url.sh
```

When prompted, paste your Render URL (e.g., `https://ai-text-humanizer.onrender.com`)

**OR manually:**

```bash
# Replace YOUR_RENDER_URL with your actual URL
sed -i 's|YOUR_RAILWAY_APP_URL_HERE|https://ai-text-humanizer.onrender.com|g' docs/index.html
git add docs/index.html
git commit -m "Add Render app URL to landing page"
git push origin main
```

---

## ⚙️ Configuration Details

### Environment Variables (Optional)

If needed, you can add environment variables in Render dashboard:
1. Go to your service
2. Click "Environment" tab
3. Add variables

### Custom Domain (Optional)

1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS as instructed

---

## 🔧 Render vs Railway Comparison

| Feature | Render | Railway |
|---------|--------|---------|
| **Free Tier** | 750 hrs/month | $5 credit/month |
| **RAM** | 512 MB | 512 MB - 8 GB |
| **Sleep Policy** | 15 min inactivity | Always on |
| **Wake Time** | 30-60 seconds | N/A |
| **Build Time** | ~5-8 minutes | ~5-10 minutes |
| **Auto Deploy** | ✅ Yes | ✅ Yes |
| **SSL/HTTPS** | ✅ Free | ✅ Free |
| **Custom Domain** | ✅ Free | ✅ Free |

**Recommendation**: Render's free tier is better for hobby projects!

---

## 📊 After Deployment

### Test Your App

1. Visit your Render URL
2. Try transforming text
3. Test all features:
   - Text input
   - File upload
   - Passive voice option
   - Synonym replacement
   - Export functionality
   - Reproducible results (seed)

### Monitor Performance

In Render Dashboard:
- **Metrics**: View CPU, Memory, Network usage
- **Logs**: Check application logs
- **Events**: See deployment history

---

## 🐛 Troubleshooting

### Build Fails

**Issue**: Dependencies installation fails

**Solution**:
```bash
# Check build logs in Render dashboard
# Verify requirements.txt is correct
# Check if Python version matches runtime.txt
```

### App Crashes

**Issue**: App shows "Application Error"

**Solution**:
1. Check logs in Render dashboard
2. Look for Python errors
3. Verify models downloaded correctly
4. Check memory usage (free tier has 512MB limit)

### Slow First Load

**Issue**: App takes 30-60 seconds to load first time

**Solution**:
- This is normal on free tier (app sleeps after 15 min)
- App will be fast once loaded
- Upgrade to paid plan ($7/month) for always-on

### Models Not Loading

**Issue**: spaCy or NLTK errors

**Solution**:
1. Check build command ran successfully
2. Verify in logs:
   ```
   Successfully installed spacy
   Successfully downloaded en_core_web_sm
   Downloaded punkt
   ```
3. If missing, rebuild the service

---

## 💰 Pricing

### Free Tier (Perfect for this app!)
- **Cost**: $0/month
- **Hours**: 750/month (24/7 uptime!)
- **RAM**: 512 MB
- **Bandwidth**: 100 GB/month
- **Sleep**: After 15 min inactivity
- **Build Minutes**: 500/month

### Paid Plans (If Needed)
- **Starter**: $7/month
  - Always-on (no sleep)
  - 512 MB RAM
  - Better performance

- **Standard**: $25/month
  - 2 GB RAM
  - Priority support

**For this app**: Free tier is sufficient! 512 MB is enough for the models.

---

## 🔄 Auto-Deployment

### How It Works

1. You push changes to GitHub
2. Render automatically detects changes
3. Rebuilds and deploys new version
4. Zero downtime deployment

### Manual Deploy

If needed:
1. Go to Render dashboard
2. Click your service
3. Click "Manual Deploy" → "Deploy latest commit"

---

## 📈 Performance Tips

### Optimize for Free Tier

1. **Keep app warm** (optional):
   - Use UptimeRobot to ping every 5 min
   - Prevents sleep, keeps app responsive

2. **Optimize models**:
   - Models are already optimized (small spaCy model)
   - NLTK data is minimal

3. **Monitor usage**:
   - Check metrics in dashboard
   - Stay within free tier limits

---

## ✅ Deployment Checklist

- [ ] Render account created
- [ ] Repository connected
- [ ] Web service configured
- [ ] Build completed successfully
- [ ] App is live and accessible
- [ ] Render URL copied
- [ ] Landing page updated with URL
- [ ] All features tested
- [ ] GitHub Pages enabled
- [ ] Both URLs working

---

## 🎉 Final URLs

After completing all steps:

| Service | URL |
|---------|-----|
| **Live App** | `https://ai-text-humanizer.onrender.com` |
| **Landing Page** | `https://alimehdi512.github.io/AI-Text-Humanizer-App/` |
| **Repository** | `https://github.com/AliMehdi512/AI-Text-Humanizer-App` |

---

## 🆘 Need Help?

### Render Resources
- Docs: [render.com/docs](https://render.com/docs)
- Status: [status.render.com](https://status.render.com)
- Community: [community.render.com](https://community.render.com)

### Your Project Docs
- `README.md` - Complete guide
- `QUICK_START.md` - Fast reference
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step

---

## 🎊 Success!

Once deployed, share your app:
- Tweet about it
- Share on LinkedIn
- Submit to Streamlit Gallery
- Add to your portfolio

**Your app is now live and accessible worldwide!** 🌍

---

**Built with ❤️ and deployed on Render.com**

