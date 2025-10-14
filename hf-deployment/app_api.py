"""
AI Text Humanizer - FastAPI Entry Point for Hugging Face
This is the entry point for Hugging Face Spaces deployment with FastAPI
"""

from api_main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
