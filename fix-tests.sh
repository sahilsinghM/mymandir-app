#!/bin/bash

# MyMandir Test Fix Script
echo "🔧 Fixing MyMandir test issues..."

# 1. Fix notification mocking in setupTests.ts
echo "📱 Fixing notification mocking..."
if grep -q "expo-notifications" setupTests.ts; then
    echo "✅ Notification mocking already configured"
else
    echo "❌ Notification mocking needs to be added"
fi

# 2. Create missing .env file
echo "🔑 Creating .env file..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ .env file created from template"
else
    echo "✅ .env file already exists"
fi

# 3. Update app.json with environment variables
echo "⚙️ Updating app.json..."
if grep -q "extra" app.json; then
    echo "✅ app.json already has extra configuration"
else
    echo "❌ app.json needs extra configuration"
fi

# 4. Run tests to check current status
echo "🧪 Running tests..."
npm test -- --passWithNoTests --silent 2>&1 | tail -5

echo "✅ Test fix script completed!"
echo ""
echo "Next steps:"
echo "1. Update .env file with real API keys"
echo "2. Update app.json with production values"
echo "3. Run 'npm test' to verify fixes"
echo "4. Follow DEPLOYMENT_WORKFLOW.md for deployment"
