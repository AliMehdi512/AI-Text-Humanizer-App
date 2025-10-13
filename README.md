---
title: AI Text Humanizer
emoji: 🧔🏻‍♂️🤖
colorFrom: purple
colorTo: blue
sdk: streamlit
sdk_version: "1.42.0"
app_file: app.py
pinned: false
license: mit
tags:
  - nlp
  - text-processing
  - academic-writing
  - text-transformation
  - spacy
  - nltk
python_version: "3.11"
---

# 🧔🏻‍♂️ AI Text Humanizer 🤖

Transform AI-generated text into natural, human-like, academic-style writing with advanced NLP techniques.

## ✨ Features

- 📝 **Contraction Expansion** - Converts informal contractions to formal language (don't → do not)
- 🎓 **Academic Transitions** - Adds professional transition words for better flow
- 🔄 **Passive Voice Conversion** - Optional transformation to passive voice for formal tone
- 📚 **Intelligent Synonym Replacement** - Context-aware word substitution using semantic similarity
- 💾 **Export Functionality** - Download transformed text as .txt files
- 🎲 **Reproducible Results** - Set random seed for consistent transformations
- 📊 **Real-time Statistics** - Track word and sentence count changes

## 🎯 How to Use

1. **Enter or upload your text** - Paste your AI-generated text or upload a .txt file
2. **Select transformation options** in the sidebar:
   - Enable Passive Voice Transformation
   - Enable Synonym Replacement
   - Enable Reproducible Results (set seed)
3. **Click "Transform to Academic Style"**
4. **Review the results** - Compare statistics and download if needed

## 🛠️ Tech Stack

- **Framework**: Streamlit 1.42.0
- **NLP Processing**: spaCy 3.8.4
- **Semantic Analysis**: Sentence Transformers 3.4.1
- **Text Processing**: NLTK 3.9.1
- **ML Backend**: PyTorch 2.6.0

## 📊 Performance

- ⚡ Model caching for 70% faster repeat transformations
- 🎯 Optimized dependencies (18 essential packages)
- 🛡️ Comprehensive error handling
- 💾 Minimal memory footprint (~1GB)

## 🔧 How It Works

1. **Contraction Expansion** - Uses NLTK tokenization with smart spacing
2. **Academic Transitions** - Adds formal connectors (Moreover, Additionally, etc.)
3. **Passive Voice** - spaCy dependency parsing identifies Subject-Verb-Object patterns
4. **Synonym Replacement** - WordNet synonyms filtered by semantic similarity (>0.5 threshold)

## 📈 Use Cases

Perfect for:
- Students formalizing casual writing
- Content creators humanizing AI-generated text
- Researchers improving draft readability
- Anyone needing quick academic tone conversion

## 🌟 Example

**Input:**
```
I don't think this'll work. It's really bad.
```

**Output:**
```
Moreover, I do not think this will work. Furthermore, it is really bad.
```

## 📝 License

MIT License - Feel free to use and modify!

## 🔗 Links

- **GitHub Repository**: https://github.com/AliMehdi512/AI-Text-Humanizer-App
- **Documentation**: Check the README.md in the repository

## 🙏 Acknowledgments

Built with ❤️ using:
- [Streamlit](https://streamlit.io/)
- [spaCy](https://spacy.io/)
- [Hugging Face](https://huggingface.co/)
- [NLTK](https://www.nltk.org/)

---

**Made with ❤️ for the AI/NLP community**

