#!/bin/bash

# Script to update Railway URL in landing page

echo "🔧 Update Railway URL in Landing Page"
echo "======================================"
echo ""
echo "Please enter your Railway app URL (e.g., https://your-app.up.railway.app):"
read railway_url

if [ -z "$railway_url" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

echo ""
echo "Updating docs/index.html with URL: $railway_url"

# Update the href in the button
sed -i "s|YOUR_RAILWAY_APP_URL_HERE|$railway_url|g" docs/index.html

# Update the JavaScript variable
sed -i "s|const appUrl = 'YOUR_RAILWAY_APP_URL_HERE';|const appUrl = '$railway_url';|g" docs/index.html

echo "✅ Updated!"
echo ""
echo "📤 Committing and pushing changes..."

git add docs/index.html
git commit -m "Update landing page with Railway app URL: $railway_url"
git push origin main

echo ""
echo "✅ Done! GitHub Pages will update in 2-3 minutes."
echo ""
echo "Your landing page: https://alimehdi512.github.io/AI-Text-Humanizer-App/"
echo "Your app: $railway_url"
echo ""
echo "🎉 Deployment Complete!"

