#!/usr/bin/env bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting AI Text Humanizer App${NC}"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}📦 Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${BLUE}🔧 Activating virtual environment...${NC}"
source venv/bin/activate

# Install/update dependencies
echo -e "${BLUE}📚 Installing dependencies...${NC}"
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Download spaCy model if not present
echo -e "${BLUE}🧠 Checking spaCy model...${NC}"
python -c "import spacy; spacy.load('en_core_web_sm')" 2>/dev/null || python -m spacy download en_core_web_sm

# Download NLTK data
echo -e "${BLUE}📖 Checking NLTK data...${NC}"
python -c "
import nltk
import ssl
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context
    
resources = ['punkt', 'punkt_tab', 'wordnet', 'averaged_perceptron_tagger', 'averaged_perceptron_tagger_eng']
for resource in resources:
    try:
        nltk.data.find(f'tokenizers/{resource}')
    except LookupError:
        nltk.download(resource, quiet=True)
        print(f'Downloaded {resource}')
" 2>/dev/null

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo -e "${GREEN}🌐 Starting Streamlit app...${NC}"
echo ""

# Start Streamlit
streamlit run main.py

