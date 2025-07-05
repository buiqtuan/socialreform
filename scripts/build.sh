#!/bin/bash
# Build script for the entire monorepo

echo "🔧 Building Social Reform monorepo..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build shared packages first
echo "🛠️ Building shared packages..."
pnpm --filter "@social-reform/shared-types" build
pnpm --filter "@social-reform/shared-utils" build  
pnpm --filter "@social-reform/shared-config" build

# Build backend
echo "🔧 Building backend..."
pnpm --filter "backend" build

# Build mobile app
echo "📱 Building mobile app..."
pnpm --filter "mobile" build

echo "✅ Build complete!"
