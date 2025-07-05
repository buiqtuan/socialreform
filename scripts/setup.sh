#!/bin/bash
# Development setup script

echo "🚀 Setting up Social Reform development environment..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null
then
    echo "❌ pnpm is not installed. Please install pnpm first."
    echo "Run: npm install -g pnpm"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Copy environment files
echo "🔧 Setting up environment files..."
if [ ! -f apps/backend/.env.local ]; then
    cp apps/backend/.env.example apps/backend/.env.local
    echo "✅ Created apps/backend/.env.local"
    echo "⚠️  Please update the environment variables in apps/backend/.env.local"
fi

# Generate Prisma client
echo "🗃️ Generating Prisma client..."
pnpm --filter "backend" db:generate

echo "✅ Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Update environment variables in apps/backend/.env.local"
echo "2. Set up your PostgreSQL database"
echo "3. Run 'pnpm db:push' to create database tables"
echo "4. Run 'pnpm dev' to start development servers"
