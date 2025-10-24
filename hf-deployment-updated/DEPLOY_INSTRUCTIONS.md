# Hugging Face Deployment Instructions

## Quick Fix for Model Download Timeout Issues

### What's Fixed:
- ✅ Robust fallback mechanism for SentenceTransformer model loading
- ✅ Multiple model fallback options with timeout handling  
- ✅ Graceful degradation when models fail to load
- ✅ API provides basic fallback transformations
- ✅ Better error handling and logging

### Manual Deployment Steps:

1. **Go to your Hugging Face Space**: https://huggingface.co/spaces/Ali578/humanizer-api

2. **Upload Files** (drag and drop these files):
   - `api_main.py` (main FastAPI application)
   - `transformer/app.py` (updated with fallback mechanisms)
   - `requirements_api.txt` (dependencies)
   - `Dockerfile` (updated with better environment variables)
   - `nixpacks.toml` (updated start command)

3. **Set Environment Variables** (if not already set):
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_SERVICE_ROLE`: Your Supabase service role key

4. **Restart the Space**: Click the restart button in the Hugging Face interface

### What Should Happen:
- ✅ API starts successfully even if models fail to load
- ✅ Basic text transformation works (contraction expansion)
- ✅ Stripe integration remains fully functional
- ✅ No more startup crashes due to model download timeouts

### Expected Logs:
```
🔄 Initializing AI Text Humanizer...
🔄 Attempting to load model: paraphrase-MiniLM-L6-v2 (attempt 1/3)
✅ Successfully loaded model: paraphrase-MiniLM-L6-v2
✅ AI Text Humanizer initialized successfully
```

OR (if models fail):
```
🔄 Initializing AI Text Humanizer...
🔄 Attempting to load model: paraphrase-MiniLM-L6-v2 (attempt 1/3)
❌ Failed to load model paraphrase-MiniLM-L6-v2: Connection timeout
🔄 Trying next fallback model...
⚠️ All models failed to load. Running without sentence transformer model.
⚠️ API will start but text transformation features may be limited
✅ AI Text Humanizer initialized successfully
```

### Test the API:
- Health check: `https://ali578-humanizer-api.hf.space/health`
- Transform text: `https://ali578-humanizer-api.hf.space/api/transform`
- Stripe checkout: `https://ali578-humanizer-api.hf.space/api/create-checkout-session`

The API should now start successfully and handle model loading issues gracefully!
