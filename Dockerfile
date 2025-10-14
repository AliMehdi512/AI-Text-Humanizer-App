FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

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

HEALTHCHECK CMD curl --fail http://localhost:7860/health

CMD ["python", "app_api.py"]