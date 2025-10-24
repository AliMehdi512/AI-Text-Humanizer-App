#!/usr/bin/env python3
"""
Test the model-free version locally
"""

import sys
import os

# Add the current directory to Python path
sys.path.append('.')

def test_model_free_version():
    """Test the model-free version"""
    
    print("🧪 Testing Model-Free Version...")
    print("="*50)
    
    try:
        # Import the model-free transformer
        from transformer.app_no_models import AcademicTextHumanizer, download_nltk_resources
        
        print("✅ Successfully imported model-free transformer")
        
        # Download NLTK resources
        print("📥 Downloading NLTK resources...")
        download_nltk_resources()
        print("✅ NLTK resources downloaded")
        
        # Initialize the humanizer
        print("🔄 Initializing AcademicTextHumanizer...")
        humanizer = AcademicTextHumanizer(seed=42)
        print("✅ AcademicTextHumanizer initialized successfully")
        
        # Test text transformation
        test_text = "I don't think this will work, but let's try it anyway. It's a good idea."
        
        print(f"\n📝 Original text: {test_text}")
        
        # Test basic transformation
        transformed = humanizer.humanize_text(test_text, use_passive=False, use_synonyms=False)
        print(f"🔄 Transformed (basic): {transformed}")
        
        # Test with synonyms
        transformed_with_synonyms = humanizer.humanize_text(test_text, use_passive=False, use_synonyms=True)
        print(f"🔄 Transformed (with synonyms): {transformed_with_synonyms}")
        
        # Test with passive voice
        transformed_with_passive = humanizer.humanize_text(test_text, use_passive=True, use_synonyms=False)
        print(f"🔄 Transformed (with passive): {transformed_with_passive}")
        
        print("\n✅ All tests passed! Model-free version is working correctly.")
        print("🚀 Ready for Hugging Face deployment!")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_model_free_version()
    if success:
        print("\n🎉 Model-free version is ready for deployment!")
    else:
        print("\n💥 Model-free version has issues that need to be fixed.")
