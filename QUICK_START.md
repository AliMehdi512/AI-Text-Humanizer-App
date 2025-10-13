# 🚀 Quick Start Guide

## Local Development (2 minutes)

```bash
# Clone or navigate to project
cd AI-Text-Humanizer-App-main

# Run the quick start script
./start.sh

# Or manually:
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
streamlit run main.py
```

Visit: `http://localhost:8501`

---

## Deploy to Railway (5 minutes)

### 1️⃣ Push to GitHub
```bash
git init
git add .
git commit -m "Production ready"
git remote add origin https://github.com/YOUR_USERNAME/AI-Text-Humanizer-App.git
git push -u origin main
```

### 2️⃣ Deploy on Railway
1. Visit [railway.app](https://railway.app)
2. Login with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Wait ~10 minutes for build
6. Copy your app URL

### 3️⃣ Update Landing Page
```bash
# Edit docs/index.html
# Replace YOUR_RAILWAY_APP_URL_HERE with your Railway URL
# Replace YOUR_USERNAME with your GitHub username
git add docs/index.html
git commit -m "Update landing page URLs"
git push origin main
```

### 4️⃣ Enable GitHub Pages
1. Repository Settings → Pages
2. Source: Branch `main`, Folder `/docs`
3. Save
4. Wait 2-3 minutes

**Done!** 🎉

Your landing page: `https://YOUR_USERNAME.github.io/AI-Text-Humanizer-App/`

---

## Project Structure

```
📁 AI-Text-Humanizer-App-main/
│
├── 🎯 Core Files
│   ├── main.py                 # Streamlit app
│   └── transformer/app.py      # NLP logic
│
├── ⚙️ Configuration
│   ├── requirements.txt        # Dependencies
│   ├── railway.json           # Railway config
│   ├── nixpacks.toml          # Build config
│   └── .streamlit/config.toml # Streamlit config
│
├── 🌐 Landing Page
│   └── docs/index.html        # GitHub Pages
│
└── 📚 Documentation
    ├── README.md              # Full documentation
    ├── DEPLOYMENT.md          # Deployment guide
    └── QUICK_START.md         # This file
```

---

## Key Features

✅ **Contraction Expansion** - "don't" → "do not"  
✅ **Academic Transitions** - Adds formal transitions  
✅ **Passive Voice** - Active → Passive conversion  
✅ **Synonym Replacement** - Context-aware substitutions  
✅ **Export Text** - Download as .txt  
✅ **Reproducible** - Set seed for consistent results  

---

## Common Commands

```bash
# Local development
./start.sh

# Run manually
streamlit run main.py

# Verify deployment readiness
python3 verify_deployment.py

# Install dependencies only
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

---

## Troubleshooting

**Port already in use?**
```bash
streamlit run main.py --server.port=8502
```

**Models not found?**
```bash
python -m spacy download en_core_web_sm
python -c "import nltk; nltk.download('punkt'); nltk.download('wordnet')"
```

**Railway build fails?**
- Check logs in Railway dashboard
- Verify all files pushed to GitHub
- Check Python version in runtime.txt

---

## Need Help?

📖 **Full Docs**: `README.md`  
🚀 **Deployment Guide**: `DEPLOYMENT.md`  
✅ **Checklist**: `DEPLOYMENT_CHECKLIST.md`  
📊 **What Changed**: `IMPROVEMENTS.md`  

---

## URLs After Deployment

Replace with your actual URLs:

- 🌐 **Landing Page**: `https://YOUR_USERNAME.github.io/AI-Text-Humanizer-App/`
- 🚀 **Live App**: `https://your-app.up.railway.app`
- 📦 **Repository**: `https://github.com/YOUR_USERNAME/AI-Text-Humanizer-App`

---

**That's it! Simple and ready to go.** 🎉

