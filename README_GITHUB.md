# 🧔🏻‍♂️ AI Text Humanizer 🤖

[![Railway Deploy](https://img.shields.io/badge/Deploy%20on-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.42.0-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)](https://streamlit.io/)

Transform your AI-generated text into natural, human-like, academic-style writing with advanced NLP techniques.

## ✨ Features

- 📝 **Contraction Expansion**: Converts informal contractions to formal language (don't → do not)
- 🎓 **Academic Transitions**: Adds professional transition words for better flow
- 🔄 **Passive Voice Conversion**: Optional transformation to passive voice for formal tone
- 📚 **Intelligent Synonym Replacement**: Context-aware word substitution using semantic similarity
- 💾 **Export Functionality**: Download transformed text as .txt files
- 🎲 **Reproducible Results**: Set random seed for consistent transformations
- 📊 **Real-time Statistics**: Track word and sentence count changes
- ⚡ **Optimized Performance**: Model caching for faster processing

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/AI-Text-Humanizer-App.git
   cd AI-Text-Humanizer-App
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

4. **Run the app**
   ```bash
   streamlit run main.py
   ```

5. **Open your browser**
   Navigate to `http://localhost:8501`

## 🌐 Deployment

### Deploy on Railway (Backend)

Railway is perfect for hosting the Streamlit app:

1. **Prerequisites**
   - Railway account ([railway.app](https://railway.app))
   - GitHub repository with your code

2. **Deploy Steps**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect the configuration from `nixpacks.toml` and `railway.json`
   - Wait for deployment to complete (~5-10 minutes)
   - Copy your Railway app URL (e.g., `https://your-app.railway.app`)

3. **Environment Variables** (Optional)
   - `PORT`: Automatically set by Railway
   - Add custom variables in Railway dashboard if needed

### Deploy Landing Page on GitHub Pages (Frontend)

Host a beautiful landing page that links to your Railway app:

1. **Update the landing page**
   - Edit `docs/index.html`
   - Replace `YOUR_RAILWAY_APP_URL_HERE` with your Railway app URL
   - Replace `YOUR_USERNAME` with your GitHub username

2. **Enable GitHub Pages**
   - Go to your repository Settings
   - Navigate to "Pages" section
   - Source: Deploy from a branch
   - Branch: `main` or `master`
   - Folder: `/docs`
   - Click Save

3. **Access your landing page**
   - Your page will be available at: `https://YOUR_USERNAME.github.io/AI-Text-Humanizer-App/`
   - It may take a few minutes to deploy

## 📋 Requirements

- Python 3.11+
- 1GB+ RAM (for ML models)
- Internet connection (for initial model downloads)

## 🛠️ Tech Stack

- **Frontend & Backend**: Streamlit 1.42.0
- **NLP Processing**: spaCy 3.8.4
- **Semantic Analysis**: Sentence Transformers 3.4.1
- **Text Processing**: NLTK 3.9.1
- **ML Framework**: PyTorch 2.6.0

## 📁 Project Structure

```
AI-Text-Humanizer-App/
├── main.py                 # Streamlit app entry point
├── transformer/
│   ├── __init__.py        # Package initializer
│   └── app.py             # Core transformation logic
├── docs/
│   └── index.html         # GitHub Pages landing page
├── .streamlit/
│   └── config.toml        # Streamlit configuration
├── requirements.txt       # Python dependencies (optimized)
├── setup.sh              # Installation script
├── nixpacks.toml         # Railway build configuration
├── railway.json          # Railway deployment config
├── runtime.txt           # Python version
├── Procfile              # Alternative deployment config
└── README.md             # This file
```

## 🎯 Usage

1. **Enter or upload text**: Paste your AI-generated text or upload a .txt file
2. **Select options**:
   - ✅ Enable Passive Voice Transformation
   - ✅ Enable Synonym Replacement
   - 🎲 Enable Reproducible Results (set seed)
3. **Transform**: Click the "Transform to Academic Style" button
4. **Review**: Check the transformed text and statistics
5. **Export**: Download the result as a .txt file

## 🔧 Configuration

### Transformation Probabilities

Edit in `main.py` or `transformer/app.py`:

```python
humanizer = AcademicTextHumanizer(
    p_passive=0.3,              # 30% chance of passive voice
    p_synonym_replacement=0.3,  # 30% chance of synonym replacement
    p_academic_transition=0.4,  # 40% chance of adding transitions
    seed=42                     # Set seed for reproducibility
)
```

### Streamlit Theme

Customize in `.streamlit/config.toml`:

```toml
[theme]
primaryColor = "#FF4B4B"
backgroundColor = "#FFFFFF"
```

## 📊 Performance Optimizations

✅ Model caching with `@st.cache_resource`  
✅ Lazy loading of NLP models  
✅ Optimized dependencies (removed 70+ unused packages)  
✅ Efficient tokenization with proper spacing  
✅ Error handling throughout the pipeline  

## 🐛 Troubleshooting

### Models not downloading
```bash
python -m spacy download en_core_web_sm
python -c "import nltk; nltk.download('punkt'); nltk.download('wordnet')"
```

### Railway deployment fails
- Check build logs in Railway dashboard
- Ensure `nixpacks.toml` and `railway.json` are in repository root
- Verify Python version in `runtime.txt` matches your local version

### Out of memory errors
- Railway free tier has memory limits
- Consider upgrading to paid tier for larger models
- Reduce batch size in transformation settings

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Original concept inspired by academic writing tools
- Built with [Streamlit](https://streamlit.io/)
- NLP powered by [spaCy](https://spacy.io/) and [Hugging Face](https://huggingface.co/)

## 📧 Contact

For issues, questions, or suggestions:
- Open an issue on GitHub
- Visit the [discussions page](https://github.com/YOUR_USERNAME/AI-Text-Humanizer-App/discussions)

## 🌟 Support

If you find this project helpful, please give it a ⭐️ on GitHub!

---

**Note**: After deploying to Railway, remember to update:
1. The Railway app URL in `docs/index.html`
2. Your GitHub username in this README
3. Repository links throughout the documentation

