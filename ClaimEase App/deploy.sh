#!/bin/bash

# ClaimEase Deployment Script
echo "🚀 Starting ClaimEase deployment..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Firebase (if using Firebase)
    echo "🔥 Deploying to Firebase..."
    firebase deploy
    
    echo "🎉 Deployment complete!"
else
    echo "❌ Build failed!"
    exit 1
fi