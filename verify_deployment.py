#!/usr/bin/env python3
"""
Deployment Verification Script
Checks if all requirements are met before deployment
"""

import sys
import os
from pathlib import Path

def check_file_exists(filepath, description):
    """Check if a file exists"""
    if Path(filepath).exists():
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description} MISSING: {filepath}")
        return False

def check_directory_exists(dirpath, description):
    """Check if a directory exists"""
    if Path(dirpath).is_dir():
        print(f"✅ {description}: {dirpath}")
        return True
    else:
        print(f"❌ {description} MISSING: {dirpath}")
        return False

def verify_imports():
    """Verify all required imports work"""
    print("\n📦 Checking Python imports...")
    try:
        import streamlit
        print(f"✅ Streamlit {streamlit.__version__}")
    except ImportError:
        print("❌ Streamlit not installed")
        return False
    
    try:
        import spacy
        print(f"✅ spaCy {spacy.__version__}")
    except ImportError:
        print("❌ spaCy not installed")
        return False
    
    try:
        import nltk
        print(f"✅ NLTK {nltk.__version__}")
    except ImportError:
        print("❌ NLTK not installed")
        return False
    
    try:
        import sentence_transformers
        print(f"✅ Sentence Transformers {sentence_transformers.__version__}")
    except ImportError:
        print("❌ Sentence Transformers not installed")
        return False
    
    return True

def verify_models():
    """Verify required models are available"""
    print("\n🧠 Checking NLP models...")
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
        print("✅ spaCy model 'en_core_web_sm' loaded")
    except OSError:
        print("❌ spaCy model 'en_core_web_sm' not found")
        print("   Run: python -m spacy download en_core_web_sm")
        return False
    
    try:
        import nltk
        nltk.data.find('tokenizers/punkt')
        print("✅ NLTK 'punkt' data found")
    except LookupError:
        print("⚠️  NLTK 'punkt' data not found (will download on first run)")
    
    return True

def verify_deployment_files():
    """Check all deployment configuration files"""
    print("\n🚀 Checking deployment files...")
    checks = []
    
    # Essential files
    checks.append(check_file_exists("main.py", "Main application"))
    checks.append(check_file_exists("requirements.txt", "Requirements file"))
    checks.append(check_file_exists("transformer/app.py", "Transformer module"))
    
    # Railway deployment
    checks.append(check_file_exists("railway.json", "Railway config"))
    checks.append(check_file_exists("nixpacks.toml", "Nixpacks config"))
    checks.append(check_file_exists("runtime.txt", "Runtime config"))
    checks.append(check_file_exists("setup.sh", "Setup script"))
    
    # Streamlit config
    checks.append(check_directory_exists(".streamlit", "Streamlit directory"))
    checks.append(check_file_exists(".streamlit/config.toml", "Streamlit config"))
    
    # Documentation
    checks.append(check_file_exists("README.md", "README"))
    checks.append(check_file_exists("DEPLOYMENT.md", "Deployment guide"))
    
    # GitHub Pages
    checks.append(check_directory_exists("docs", "Docs directory"))
    checks.append(check_file_exists("docs/index.html", "Landing page"))
    
    # Git
    checks.append(check_file_exists(".gitignore", "Git ignore file"))
    
    return all(checks)

def verify_code_quality():
    """Run basic code quality checks"""
    print("\n🔍 Checking code quality...")
    
    # Check if files are not empty
    files_to_check = ["main.py", "transformer/app.py"]
    for filepath in files_to_check:
        try:
            with open(filepath, 'r') as f:
                content = f.read()
                if len(content) > 100:
                    print(f"✅ {filepath} has content ({len(content)} chars)")
                else:
                    print(f"⚠️  {filepath} seems too short")
        except FileNotFoundError:
            print(f"❌ {filepath} not found")
            return False
    
    # Try to import the transformer module
    try:
        sys.path.insert(0, str(Path.cwd()))
        from transformer.app import AcademicTextHumanizer, load_spacy_model
        print("✅ Transformer module imports successfully")
    except Exception as e:
        print(f"❌ Error importing transformer module: {e}")
        return False
    
    return True

def main():
    """Main verification function"""
    print("=" * 60)
    print("🔍 AI Text Humanizer - Deployment Verification")
    print("=" * 60)
    
    results = []
    
    # Run all checks
    results.append(("Deployment Files", verify_deployment_files()))
    results.append(("Python Imports", verify_imports()))
    results.append(("NLP Models", verify_models()))
    results.append(("Code Quality", verify_code_quality()))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Verification Summary")
    print("=" * 60)
    
    all_passed = True
    for check_name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{check_name}: {status}")
        if not passed:
            all_passed = False
    
    print("=" * 60)
    
    if all_passed:
        print("\n🎉 All checks passed! Ready for deployment!")
        print("\n📋 Next Steps:")
        print("1. Commit your changes: git add . && git commit -m 'Ready for deployment'")
        print("2. Push to GitHub: git push origin main")
        print("3. Deploy on Railway: Follow DEPLOYMENT.md")
        print("4. Enable GitHub Pages: Repository Settings → Pages")
        print("\n🚀 Happy deploying!")
        return 0
    else:
        print("\n⚠️  Some checks failed. Please fix the issues above.")
        print("\n💡 Tips:")
        print("- Install missing packages: pip install -r requirements.txt")
        print("- Download models: python -m spacy download en_core_web_sm")
        print("- Check file paths and permissions")
        return 1

if __name__ == "__main__":
    sys.exit(main())

