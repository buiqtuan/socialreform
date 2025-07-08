#!/bin/bash

# Test Setup Script for Social Reform Backend
echo "🧪 Setting up test environment for Social Reform..."

# Navigate to backend directory
cd "$(dirname "$0")/../apps/backend" || exit

# Install test dependencies if they don't exist
echo "📦 Installing test dependencies..."
pnpm add -D @types/jest @types/supertest jest jest-environment-node supertest ts-jest

# Create test environment file if it doesn't exist
if [ ! -f ".env.test" ]; then
    echo "📝 Creating test environment file..."
    cp .env.test.example .env.test
    echo "⚠️  Please update .env.test with your test database credentials"
fi

# Create test database (assuming PostgreSQL)
echo "🗄️  Setting up test database..."
echo "Please ensure your test database exists and is accessible"
echo "Example commands to create test database:"
echo "  createdb social_reform_test"
echo "  Or use your preferred database management tool"

# Run initial database setup for tests
echo "🔄 Running database migrations for test environment..."
# You might need to set NODE_ENV=test here
# DATABASE_URL should point to test database
# pnpm prisma migrate dev

echo ""
echo "✅ Test setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.test with your test database URL"
echo "2. Run: pnpm db:migrate (ensure test DB is migrated)"
echo "3. Run tests: pnpm test:integration"
echo ""
echo "Available test commands:"
echo "  pnpm test:integration  # Run all integration tests"
echo "  pnpm test:watch       # Run tests in watch mode"
echo "  pnpm test:coverage    # Run tests with coverage report"
echo ""
