#!/bin/bash

# Social Reform - Environment Setup Script
# This script helps set up environment variables for development

echo "🚀 Social Reform - Environment Setup"
echo "======================================"

# Check if .env exists
if [ -f "apps/backend/.env" ]; then
    echo "✅ Backend .env file already exists"
else
    echo "📝 Creating backend .env file from template..."
    cp apps/backend/.env.example apps/backend/.env
    echo "✅ Created apps/backend/.env"
    echo "⚠️  Please update the DATABASE_URL and other credentials in apps/backend/.env"
fi

# Check if mobile .env exists
if [ -f "apps/mobile/.env" ]; then
    echo "✅ Mobile .env file already exists"
else
    echo "📝 Creating mobile .env file from template..."
    cp apps/mobile/.env.example apps/mobile/.env
    echo "✅ Created apps/mobile/.env"
    echo "⚠️  Please update the API_URL in apps/mobile/.env"
fi

echo ""
echo "🔧 Next steps:"
echo "1. Update DATABASE_URL in apps/backend/.env with your Railway connection string"
echo "2. Update JWT secrets in apps/backend/.env"
echo "3. Run 'pnpm install' to install dependencies"
echo "4. Run 'pnpm db:push' to sync database schema"
echo "5. Run 'pnpm dev' to start development servers"
echo ""
echo "📚 For more info, check the README.md file"
