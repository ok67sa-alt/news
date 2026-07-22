#!/bin/bash

# 🚀 Hostinger Deployment Script
# Run this on your Hostinger server via SSH

echo "🚀 Starting deployment..."

# 1. Navigate to project directory
cd ~/public_html/your-project-name || exit
# Update the path above to match your actual project location

# 2. Pull latest code from Git
echo "📥 Pulling latest code from Git..."
git pull origin main

# 3. Install/Update dependencies
echo "📦 Installing dependencies..."
npm install

# 4. Delete old build cache
echo "🗑️  Deleting old .next cache..."
rm -rf .next

# 5. Build the project
echo "🔨 Building project..."
npm run build

# 6. Restart Node.js application
echo "🔄 Restarting Node.js..."
# For Hostinger, you typically need to restart via their control panel
# Or use their restart command if available
# pkill -f "node.*next"
# npm start &

echo "✅ Deployment complete!"
echo "⚠️  If using Hostinger control panel, manually restart Node.js app now"
echo "Then clear browser cache and hard refresh (Ctrl+F5)"
