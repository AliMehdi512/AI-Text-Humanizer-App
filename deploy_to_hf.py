#!/usr/bin/env python3
"""
Script to help deploy the model-free version to Hugging Face
"""

import os
import shutil
import zipfile
from pathlib import Path

def create_deployment_package():
    """Create a deployment package for Hugging Face"""
    
    print("🚀 Creating Hugging Face Deployment Package...")
    
    # Source directory
    source_dir = Path("hf-deployment-model-free")
    
    # Create deployment package
    package_dir = Path("hf-deployment-package")
    if package_dir.exists():
        shutil.rmtree(package_dir)
    package_dir.mkdir()
    
    # Copy files
    files_to_copy = [
        "api_main.py",
        "transformer_app.py", 
        "requirements_api.txt",
        "Dockerfile",
        "nixpacks.toml"
    ]
    
    for file in files_to_copy:
        src = source_dir / file
        dst = package_dir / file
        if src.exists():
            shutil.copy2(src, dst)
            print(f"✅ Copied {file}")
        else:
            print(f"❌ Missing {file}")
    
    # Create a zip file for easy upload
    zip_path = Path("hf-deployment.zip")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file_path in package_dir.rglob('*'):
            if file_path.is_file():
                arcname = file_path.relative_to(package_dir)
                zipf.write(file_path, arcname)
    
    print(f"📦 Created deployment package: {package_dir}")
    print(f"📦 Created zip file: {zip_path}")
    
    # Create deployment instructions
    instructions = """
# 🚀 HUGGING FACE DEPLOYMENT - STEP BY STEP

## 📋 What You Need to Do:

### Step 1: Go to Your Hugging Face Space
- Visit: https://huggingface.co/spaces/Ali578/humanizer-api
- Click on the "Files" tab

### Step 2: Delete All Existing Files
- Select all files in the repository
- Click "Delete" to remove them
- This ensures a clean deployment

### Step 3: Upload New Files
Upload these 5 files from the `hf-deployment-package/` folder:

1. **api_main.py** - Main FastAPI application (model-free)
2. **transformer_app.py** - Text transformation logic (no external models)
3. **requirements_api.txt** - Dependencies (no sentence-transformers)
4. **Dockerfile** - Container configuration
5. **nixpacks.toml** - Hugging Face deployment config

### Step 4: Set Environment Variables (if needed)
Go to "Settings" → "Variables" and ensure these are set:
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET  
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE

### Step 5: Restart the Space
- Go to the "App" tab
- Click the restart button (🔄)

## 🎯 Expected Results:

**Startup Logs:**
```
🔄 Initializing AI Text Humanizer (Model-Free Version)...
✅ AcademicTextHumanizer initialized (model-free version)
✅ AI Text Humanizer initialized successfully (Model-Free Version)
```

**No More Errors:**
- ❌ No model download timeouts
- ❌ No external dependencies
- ✅ Fast startup
- ✅ All features work

## 🧪 Test the API:

After deployment, test with:
```bash
curl https://ali578-humanizer-api.hf.space/health
```

Should return:
```json
{
  "status": "healthy",
  "message": "All systems operational (Model-Free Version)",
  "version": "2.1.0"
}
```

## 🎉 Success!

If you see the health check working, your API is successfully deployed!
"""
    
    with open("DEPLOYMENT_STEPS.md", "w") as f:
        f.write(instructions)
    
    print("📝 Created DEPLOYMENT_STEPS.md with detailed instructions")
    print("\n" + "="*60)
    print("🎯 NEXT STEPS:")
    print("1. Read DEPLOYMENT_STEPS.md")
    print("2. Upload files from hf-deployment-package/ to Hugging Face")
    print("3. Restart the Space")
    print("4. Test the API")
    print("="*60)

if __name__ == "__main__":
    create_deployment_package()
