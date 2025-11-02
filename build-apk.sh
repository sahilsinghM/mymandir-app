#!/bin/bash

# MyMandir APK Build Script
# This script will help you build an APK for the MyMandir app

set -e

echo "🚀 MyMandir APK Build Script"
echo "============================"
echo ""

# Check if already logged in
if npx eas-cli whoami &>/dev/null; then
    echo "✅ Already logged in to Expo"
    USER=$(npx eas-cli whoami)
    echo "   Logged in as: $USER"
else
    echo "📝 Please login to Expo:"
    echo "   Visit: https://expo.dev/signup (create free account if needed)"
    echo ""
    read -p "Press Enter to start login process..."
    npx eas-cli login
fi

echo ""
echo "⚙️  Initializing EAS project..."
if [ ! -f ".easignore" ]; then
    echo "   First time setup - this will link your project to Expo"
    echo "   Press Enter and type 'y' when asked to create project"
    read -p "Press Enter to continue..."
    npx eas-cli init
else
    echo "   Project already initialized"
fi

echo ""
echo "🔨 Starting Android APK build..."
echo "   This will take 10-20 minutes"
echo ""

# Start the build (interactive mode - will prompt for any needed info)
npx eas-cli build --platform android --profile preview

echo ""
echo "✅ Build started successfully!"
echo "📱 Check your build status at: https://expo.dev"
echo "📥 Download the APK when build completes"

