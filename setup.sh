#!/usr/bin/env bash

echo "📦 Installing pip dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "🔧 Installing spaCy model..."
python -m spacy download en_core_web_sm

echo "📚 Downloading NLTK data..."
python -c "
import nltk
import ssl

try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

# Download only required NLTK resources
resources = ['punkt', 'punkt_tab', 'wordnet', 'averaged_perceptron_tagger', 'averaged_perceptron_tagger_eng']
for resource in resources:
    try:
        nltk.download(resource, quiet=True)
        print(f'✅ Downloaded {resource}')
    except Exception as e:
        print(f'⚠️  Error downloading {resource}: {e}')
"

echo "✅ Setup complete!"
