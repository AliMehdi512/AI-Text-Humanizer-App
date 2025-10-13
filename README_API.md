---
title: AI Text Humanizer API
emoji: 🚀
colorFrom: purple
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
license: mit
tags:
  - nlp
  - api
  - fastapi
  - text-processing
  - academic-writing
python_version: "3.11"
---

# 🚀 AI Text Humanizer API

**Professional REST API** for transforming AI-generated text into natural, human-like academic writing.

## 🎯 Features

- ✅ **RESTful API** - Clean, modern API endpoints
- ✅ **File Upload** - Transform text from uploaded .txt files
- ✅ **Real-time Processing** - Fast text transformation
- ✅ **Statistics** - Word count, sentence count, processing time
- ✅ **Multiple Options** - Passive voice, synonym replacement, seed control
- ✅ **CORS Enabled** - Ready for frontend integration
- ✅ **Auto Documentation** - Interactive API docs at `/docs`

## 📚 API Endpoints

### `GET /` - Health Check
```json
{
  "status": "healthy",
  "message": "AI Text Humanizer API is running",
  "version": "2.0.0"
}
```

### `POST /api/transform` - Transform Text
```json
{
  "text": "I don't think this'll work. It's really bad.",
  "use_passive": true,
  "use_synonyms": true,
  "seed": 42
}
```

**Response:**
```json
{
  "success": true,
  "original_text": "I don't think this'll work...",
  "transformed_text": "Furthermore, I do not think this will work...",
  "original_word_count": 8,
  "transformed_word_count": 12,
  "original_sentence_count": 2,
  "transformed_sentence_count": 2,
  "transformations_applied": ["Contraction Expansion", "Passive Voice", "Synonym Replacement", "Academic Transitions"],
  "processing_time": 0.45
}
```

### `POST /api/transform-file` - Transform File
Upload a .txt file and get transformed text back.

### `GET /api/features` - Get Available Features
```json
{
  "features": [
    {
      "name": "Contraction Expansion",
      "description": "Converts informal contractions to formal language",
      "example": "don't → do not",
      "enabled": true
    }
  ]
}
```

### `GET /api/stats` - Get API Statistics
```json
{
  "version": "2.0.0",
  "status": "operational",
  "features": 4,
  "supported_formats": [".txt"],
  "processing_engines": ["spaCy 3.8.4", "NLTK 3.9.1", "Sentence Transformers 3.4.1"]
}
```

## 🛠️ Tech Stack

- **FastAPI** - Modern, fast web framework
- **spaCy** - Advanced NLP processing
- **NLTK** - Text tokenization and WordNet
- **Sentence Transformers** - Semantic similarity
- **Uvicorn** - ASGI server

## 🔧 Usage Examples

### JavaScript/Frontend
```javascript
const response = await fetch('https://your-api.hf.space/api/transform', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Your AI-generated text here',
    use_passive: true,
    use_synonyms: false,
    seed: 42
  })
});

const result = await response.json();
console.log(result.transformed_text);
```

### Python
```python
import requests

response = requests.post('https://your-api.hf.space/api/transform', json={
    'text': 'Your AI-generated text here',
    'use_passive': True,
    'use_synonyms': False,
    'seed': 42
})

result = response.json()
print(result['transformed_text'])
```

### cURL
```bash
curl -X POST "https://your-api.hf.space/api/transform" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I don'\''t think this'\''ll work. It'\''s really bad.",
    "use_passive": true,
    "use_synonyms": true,
    "seed": 42
  }'
```

## 📊 Performance

- **Processing Time**: ~0.1-1.0 seconds per transformation
- **Memory Usage**: ~1GB (models loaded)
- **Concurrent Requests**: Supported
- **Rate Limiting**: None (free tier)

## 🔒 CORS Configuration

API is configured to accept requests from:
- `https://alimehdi512.github.io`
- `http://localhost:3000`
- `http://localhost:8080`

## 📖 Interactive Documentation

Visit `/docs` for interactive API documentation with:
- ✅ Try-it-out functionality
- ✅ Request/response schemas
- ✅ Authentication info
- ✅ Example requests

## 🌐 Frontend Integration

This API is designed to work with the modern frontend at:
- **GitHub Pages**: https://alimehdi512.github.io/AI-Text-Humanizer-App/
- **Features**: Beautiful UI, real-time processing, file uploads

## 📝 License

MIT License - Feel free to use and integrate!

## 🔗 Links

- **Frontend**: https://alimehdi512.github.io/AI-Text-Humanizer-App/
- **GitHub**: https://github.com/AliMehdi512/AI-Text-Humanizer-App
- **API Docs**: `/docs` (when deployed)

---

**Built with ❤️ for the AI/NLP community**
