#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║         🤗 HUGGING FACE DEPLOYMENT HELPER 🤗                     ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Check if space is created
echo "Have you created your Space on Hugging Face? (yes/no)"
read space_created

if [ "$space_created" != "yes" ] && [ "$space_created" != "y" ]; then
    echo ""
    echo "❌ Please create your Space first:"
    echo "1. Go to: https://huggingface.co/new-space"
    echo "2. Fill in:"
    echo "   • Space name: ai-text-humanizer"
    echo "   • SDK: Streamlit"
    echo "   • Hardware: CPU basic (FREE)"
    echo "   • Visibility: Public"
    echo "3. Click 'Create Space'"
    echo ""
    echo "Then run this script again!"
    exit 1
fi

echo ""
echo "✅ Great! Now enter your Hugging Face username:"
read hf_username

if [ -z "$hf_username" ]; then
    echo "❌ Username cannot be empty!"
    exit 1
fi

echo ""
echo "📋 Your Space URL will be:"
echo "   https://huggingface.co/spaces/$hf_username/ai-text-humanizer"
echo ""
echo "Is this correct? (yes/no)"
read confirm

if [ "$confirm" != "yes" ] && [ "$confirm" != "y" ]; then
    echo "❌ Cancelled. Run the script again with the correct username."
    exit 1
fi

echo ""
echo "🚀 Setting up Hugging Face remote..."

# Check if hf remote already exists
if git remote | grep -q "^hf$"; then
    echo "⚠️  'hf' remote already exists. Removing it..."
    git remote remove hf
fi

# Add Hugging Face remote
git remote add hf https://huggingface.co/spaces/$hf_username/ai-text-humanizer

echo "✅ Remote added!"
echo ""
echo "📤 Pushing code to Hugging Face..."
echo ""

# Push to Hugging Face
git push hf main

if [ $? -eq 0 ]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════╗"
    echo "║                    🎉 DEPLOYMENT SUCCESSFUL! 🎉                  ║"
    echo "╚══════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "✅ Your code has been pushed to Hugging Face!"
    echo ""
    echo "🔗 Your Space: https://huggingface.co/spaces/$hf_username/ai-text-humanizer"
    echo ""
    echo "⏳ Now wait 5-8 minutes for Hugging Face to:"
    echo "   1. Install dependencies"
    echo "   2. Download spaCy & NLTK models"
    echo "   3. Build and start your app"
    echo ""
    echo "📊 Watch the build progress:"
    echo "   Go to your Space → Click 'Build Logs' tab"
    echo ""
    echo "🎊 Once the build completes, your app will be LIVE!"
    echo ""
else
    echo ""
    echo "❌ Push failed! Check the error message above."
    echo ""
    echo "Common issues:"
    echo "1. Wrong username - verify at: https://huggingface.co/settings/account"
    echo "2. Space name mismatch - make sure it's 'ai-text-humanizer'"
    echo "3. Need authentication - you may need a Hugging Face token"
    echo ""
    echo "To set up authentication (if needed):"
    echo "git config --global credential.helper store"
    echo "# Then try pushing again - it will ask for your HF username and token"
    exit 1
fi

