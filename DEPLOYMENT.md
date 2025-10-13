# 🚀 Deployment Guide

This guide will walk you through deploying the AI Text Humanizer app on Railway.com with a landing page on GitHub Pages.

## 📋 Prerequisites

- [x] GitHub account
- [x] Railway account (sign up at [railway.app](https://railway.app))
- [x] Git installed locally
- [x] Project code ready to deploy

## 🎯 Part 1: Deploy App on Railway

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done)
   ```bash
   cd AI-Text-Humanizer-App-main
   git init
   git add .
   git commit -m "Initial commit - Ready for deployment"
   ```

2. **Create GitHub Repository**
   - Go to [github.com/new](https://github.com/new)
   - Name: `AI-Text-Humanizer-App`
   - Visibility: Public or Private
   - Don't initialize with README (we already have one)

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/AI-Text-Humanizer-App.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Railway

1. **Sign Up / Login to Railway**
   - Visit [railway.app](https://railway.app)
   - Click "Login" and authenticate with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `AI-Text-Humanizer-App` repository
   - Railway will automatically detect the Python project

3. **Configure Build Settings** (Auto-detected)
   Railway will use these files:
   - ✅ `nixpacks.toml` - Build configuration
   - ✅ `railway.json` - Deployment settings
   - ✅ `requirements.txt` - Dependencies
   - ✅ `runtime.txt` - Python version

4. **Wait for Build** (5-10 minutes)
   - Railway will install dependencies
   - Download spaCy and NLTK models
   - Start the Streamlit server
   - Watch the logs in Railway dashboard

5. **Get Your App URL**
   - Once deployed, Railway assigns a URL
   - Find it in: Settings → Domains
   - Example: `https://ai-text-humanizer-production.up.railway.app`
   - **Copy this URL** - you'll need it for GitHub Pages!

### Step 3: Configure Custom Domain (Optional)

1. In Railway dashboard, go to your project
2. Click "Settings" → "Domains"
3. Click "Generate Domain" or "Add Custom Domain"
4. For custom domain:
   - Add your domain (e.g., `humanizer.yourdomain.com`)
   - Update your DNS settings as shown
   - Wait for SSL certificate (automatic)

## 🌐 Part 2: Deploy Landing Page on GitHub Pages

### Step 1: Update Landing Page

1. **Edit the HTML file**
   ```bash
   cd docs
   # Open index.html in your editor
   ```

2. **Update URLs** in `docs/index.html`:
   - Line 108: Replace `YOUR_RAILWAY_APP_URL_HERE` with your Railway URL
   - Line 115: Replace `YOUR_USERNAME` with your GitHub username
   - Line 121: Update the app URL in JavaScript

   Example:
   ```html
   <a href="https://ai-text-humanizer-production.up.railway.app" class="cta-button">
       🚀 Launch App
   </a>
   ```

3. **Commit changes**
   ```bash
   git add docs/index.html
   git commit -m "Update landing page with Railway URL"
   git push origin main
   ```

### Step 2: Enable GitHub Pages

1. **Go to Repository Settings**
   - Navigate to your repository on GitHub
   - Click "Settings" tab

2. **Configure Pages**
   - Scroll down to "Pages" section (in left sidebar)
   - Under "Source":
     - Branch: `main`
     - Folder: `/docs`
   - Click "Save"

3. **Wait for Deployment** (2-3 minutes)
   - GitHub will build and deploy your page
   - You'll see a green success message with your URL

4. **Visit Your Landing Page**
   - URL format: `https://YOUR_USERNAME.github.io/AI-Text-Humanizer-App/`
   - Share this URL with users!

## ✅ Verification Checklist

After deployment, verify:

- [ ] Railway app loads successfully
- [ ] Can enter and transform text
- [ ] Download button works
- [ ] GitHub Pages landing page displays correctly
- [ ] "Launch App" button redirects to Railway URL
- [ ] Mobile responsiveness works

## 🔧 Environment Variables (If Needed)

If you need to add secrets or configuration:

### Railway
1. Go to your project in Railway
2. Click "Variables" tab
3. Add variables:
   - `CUSTOM_VAR_NAME=value`
4. Redeploy if needed

### Streamlit Secrets
1. Create `.streamlit/secrets.toml` (locally only, don't commit)
2. In Railway, add variables with prefix `STREAMLIT_`
3. Access in code: `st.secrets["key"]`

## 🐛 Troubleshooting

### Railway Build Fails

**Issue**: Build timeout or dependency errors

**Solutions**:
```bash
# Check Python version
python --version  # Should match runtime.txt

# Test locally first
pip install -r requirements.txt
streamlit run main.py

# Check Railway logs
# Go to Railway dashboard → Deployments → View logs
```

### GitHub Pages Not Updating

**Issue**: Changes not reflected on landing page

**Solutions**:
1. Clear browser cache (Ctrl+Shift+R)
2. Wait 5 minutes for CDN to update
3. Check GitHub Actions tab for build status
4. Verify `/docs` folder exists in repository

### Models Not Loading

**Issue**: spaCy or NLTK models missing

**Solutions**:
```bash
# In Railway deployment logs, verify these commands ran:
python -m spacy download en_core_web_sm
python -c "import nltk; nltk.download('punkt')"

# If not, check nixpacks.toml and setup.sh
```

### Out of Memory

**Issue**: Railway app crashes with memory errors

**Solutions**:
1. Check Railway metrics dashboard
2. Free tier: 512MB-1GB RAM limit
3. Upgrade to Pro plan: $5/month for 8GB RAM
4. Optimize model loading in code

## 📊 Monitoring

### Railway Dashboard
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time application logs
- **Deployments**: History and rollback options

### GitHub Pages
- **Actions**: Deployment status
- **Traffic**: Visitor analytics (Settings → Insights)

## 🔄 Updating Your App

### Update Code
```bash
# Make changes locally
git add .
git commit -m "Update: description of changes"
git push origin main
```

Railway auto-deploys on push! GitHub Pages updates automatically too.

### Manual Redeploy (Railway)
1. Go to Railway dashboard
2. Select your project
3. Click "Deployments"
4. Click "Redeploy" on any deployment

## 💰 Cost Estimate

### Railway
- **Free Tier**: $5 credit/month
  - Enough for ~100-200 hours runtime
  - Good for testing and low traffic
  
- **Pro Plan**: $5/month
  - $0.000463/GB-hour for memory
  - $0.000231/vCPU-hour
  - ~$10-20/month for moderate traffic

### GitHub Pages
- **100% FREE** ✨
- Unlimited bandwidth for public repositories
- Custom domain support included

## 🎉 Success!

Your app is now live! Share your URLs:

- **Landing Page**: `https://YOUR_USERNAME.github.io/AI-Text-Humanizer-App/`
- **App**: `https://your-project.up.railway.app`

## 📈 Next Steps

1. Add custom domain for professional look
2. Set up monitoring and alerts
3. Add analytics (Google Analytics, Plausible)
4. Create social media cards (og:image)
5. Submit to Streamlit Gallery
6. Add API endpoints for programmatic access

## 🆘 Need Help?

- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- GitHub Pages Docs: [docs.github.com/pages](https://docs.github.com/pages)
- Open an issue in your repository

---

Happy deploying! 🚀

