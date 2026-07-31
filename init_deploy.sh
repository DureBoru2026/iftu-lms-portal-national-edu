#!/bin/bash
# IFTU LMS - Sovereign Deployment Helper
# Use this script to prepare the production build on your local machine or mobile environment (e.g. Termux)

echo "--------------------------------------------------"
echo "🛡️  IFTU LMS: NATIONAL DEPLOYMENT PROTOCOL  🛡️"
echo "--------------------------------------------------"

# Step 1: Induction
if [ ! -d "node_modules" ]; then
    echo "📦 Phase 1: Inducting sovereign dependencies..."
    npm install
else
    echo "✅ Dependencies already inducted."
fi

# Step 2: Compilation
echo "🏗️  Phase 2: Compiling national archive..."
npm run build

if [ $? -eq 0 ]; then
    echo "--------------------------------------------------"
    echo "✅ STATUS: COMPILATION SUCCESSFUL"
    echo "📂 ACTION: Your production assets are in the 'dist' folder."
    echo "🌐 DEPLOY: Upload the 'dist' folder to Netlify (https://app.netlify.com/drop)"
    echo "--------------------------------------------------"
else
    echo "❌ STATUS: COMPILATION FAILED"
    echo "Please check the error logs above."
fi
