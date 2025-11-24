#!/bin/bash

# Deployment script for GitHub Pages
# This script prepares the files for deployment

echo "🚀 Preparing files for GitHub Pages deployment..."

# Create docs directory
mkdir -p docs

# Copy public folder contents
echo "📁 Copying files to docs folder..."
cp -r public/* docs/

# Copy README (optional)
if [ -f README.md ]; then
    cp README.md docs/ || true
fi

echo "✅ Files ready for deployment!"
echo ""
echo "Next steps:"
echo "1. git add docs/"
echo "2. git commit -m 'Deploy to GitHub Pages'"
echo "3. git push origin main"
echo ""
echo "Or enable GitHub Actions for automatic deployment!"

