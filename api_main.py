"""
AI Text Humanizer - FastAPI Backend
Modern REST API for the AI Text Humanizer application
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import uvicorn
import tempfile
import os

# Import our transformer
from transformer.app import AcademicTextHumanizer, load_spacy_model, download_nltk_resources

# Download NLTK resources on startup
download_nltk_resources()

app = FastAPI(
    title="AI Text Humanizer API",
    description="Transform AI-generated text into natural, human-like academic writing",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware - allow GitHub Pages
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://alimehdi512.github.io",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class TransformRequest(BaseModel):
    text: str
    use_passive: bool = False
    use_synonyms: bool = False
    seed: Optional[int] = None

class TransformResponse(BaseModel):
    success: bool
    original_text: str
    transformed_text: str
    original_word_count: int
    transformed_word_count: int
    original_sentence_count: int
    transformed_sentence_count: int
    transformations_applied: list
    processing_time: float

class HealthResponse(BaseModel):
    status: str
    message: str
    version: str

# Global humanizer instance
humanizer = None

@app.on_event("startup")
async def startup_event():
    """Initialize the humanizer on startup"""
    global humanizer
    try:
        humanizer = AcademicTextHumanizer(seed=42)
        print("✅ AI Text Humanizer initialized successfully")
    except Exception as e:
        print(f"❌ Error initializing humanizer: {str(e)}")
        raise

@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="AI Text Humanizer API is running",
        version="2.0.0"
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Detailed health check"""
    return HealthResponse(
        status="healthy",
        message="All systems operational",
        version="2.0.0"
    )

@app.post("/api/transform", response_model=TransformResponse)
async def transform_text(request: TransformRequest):
    """Transform text using AI Text Humanizer"""
    import time
    start_time = time.time()
    
    try:
        if not humanizer:
            raise HTTPException(status_code=500, detail="Humanizer not initialized")
        
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Set seed if provided
        if request.seed:
            import random
            random.seed(request.seed)
        
        # Transform the text
        transformed_text = humanizer.humanize_text(
            request.text,
            use_passive=request.use_passive,
            use_synonyms=request.use_synonyms
        )
        
        # Calculate statistics
        from nltk.tokenize import word_tokenize
        nlp = load_spacy_model()
        
        original_word_count = len(word_tokenize(request.text, language='english', preserve_line=True))
        transformed_word_count = len(word_tokenize(transformed_text, language='english', preserve_line=True))
        
        doc_original = nlp(request.text)
        doc_transformed = nlp(transformed_text)
        original_sentence_count = len(list(doc_original.sents))
        transformed_sentence_count = len(list(doc_transformed.sents))
        
        # Track transformations applied
        transformations = ["Contraction Expansion"]
        if request.use_passive:
            transformations.append("Passive Voice")
        if request.use_synonyms:
            transformations.append("Synonym Replacement")
        transformations.append("Academic Transitions")
        
        processing_time = time.time() - start_time
        
        return TransformResponse(
            success=True,
            original_text=request.text,
            transformed_text=transformed_text,
            original_word_count=original_word_count,
            transformed_word_count=transformed_word_count,
            original_sentence_count=original_sentence_count,
            transformed_sentence_count=transformed_sentence_count,
            transformations_applied=transformations,
            processing_time=processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transformation failed: {str(e)}")

@app.post("/api/transform-file")
async def transform_file(
    file: UploadFile = File(...),
    use_passive: bool = Form(False),
    use_synonyms: bool = Form(False),
    seed: Optional[int] = Form(None)
):
    """Transform text from uploaded file"""
    import time
    start_time = time.time()
    
    try:
        if not humanizer:
            raise HTTPException(status_code=500, detail="Humanizer not initialized")
        
        # Validate file type
        if not file.filename.endswith('.txt'):
            raise HTTPException(status_code=400, detail="Only .txt files are supported")
        
        # Read file content
        content = await file.read()
        text = content.decode('utf-8', errors='ignore')
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="File is empty")
        
        # Set seed if provided
        if seed:
            import random
            random.seed(seed)
        
        # Transform the text
        transformed_text = humanizer.humanize_text(
            text,
            use_passive=use_passive,
            use_synonyms=use_synonyms
        )
        
        # Calculate statistics
        from nltk.tokenize import word_tokenize
        nlp = load_spacy_model()
        
        original_word_count = len(word_tokenize(text, language='english', preserve_line=True))
        transformed_word_count = len(word_tokenize(transformed_text, language='english', preserve_line=True))
        
        doc_original = nlp(text)
        doc_transformed = nlp(transformed_text)
        original_sentence_count = len(list(doc_original.sents))
        transformed_sentence_count = len(list(doc_transformed.sents))
        
        # Track transformations applied
        transformations = ["Contraction Expansion"]
        if use_passive:
            transformations.append("Passive Voice")
        if use_synonyms:
            transformations.append("Synonym Replacement")
        transformations.append("Academic Transitions")
        
        processing_time = time.time() - start_time
        
        return TransformResponse(
            success=True,
            original_text=text,
            transformed_text=transformed_text,
            original_word_count=original_word_count,
            transformed_word_count=transformed_word_count,
            original_sentence_count=original_sentence_count,
            transformed_sentence_count=transformed_sentence_count,
            transformations_applied=transformations,
            processing_time=processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File transformation failed: {str(e)}")

@app.get("/api/features")
async def get_features():
    """Get available transformation features"""
    return {
        "features": [
            {
                "name": "Contraction Expansion",
                "description": "Converts informal contractions to formal language",
                "example": "don't → do not",
                "enabled": True
            },
            {
                "name": "Academic Transitions",
                "description": "Adds professional transition words",
                "example": "Moreover, Furthermore, Therefore",
                "enabled": True
            },
            {
                "name": "Passive Voice",
                "description": "Converts active voice to passive voice",
                "example": "The cat ate the mouse → The mouse was eaten by the cat",
                "enabled": False
            },
            {
                "name": "Synonym Replacement",
                "description": "Replaces words with contextually appropriate synonyms",
                "example": "good → excellent",
                "enabled": False
            }
        ]
    }

@app.get("/api/stats")
async def get_stats():
    """Get API statistics"""
    return {
        "version": "2.0.0",
        "status": "operational",
        "features": 4,
        "supported_formats": [".txt"],
        "max_file_size": "10MB",
        "processing_engines": [
            "spaCy 3.8.4",
            "NLTK 3.9.1", 
            "Sentence Transformers 3.4.1"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
