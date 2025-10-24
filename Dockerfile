FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables for better model loading
ENV HF_HUB_DISABLE_TELEMETRY=1
ENV HF_HUB_DOWNLOAD_TIMEOUT=60
ENV TRANSFORMERS_CACHE=/tmp/transformers_cache
ENV SENTENCE_TRANSFORMERS_HOME=/tmp/sentence_transformers

# Copy requirements and install dependencies
COPY requirements_api.txt ./
RUN pip install --no-cache-dir -r requirements_api.txt

# Download NLTK resources
RUN python -c "import nltk; nltk.download('punkt'); nltk.download('averaged_perceptron_tagger'); nltk.download('punkt_tab'); nltk.download('wordnet'); nltk.download('averaged_perceptron_tagger_eng')"

# Copy application files
COPY . /app

# Create user for security
RUN useradd -m -u 1000 user && chown -R user:user /app
USER user

EXPOSE 7860

HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD curl --fail http://localhost:7860/health

CMD ["python", "api_main.py"]