#!/bin/bash

# Development setup script for Digital Business Card Pro
# This script sets up the development environment

set -e  # Exit on any error

echo "🛠️  Setting up Digital Business Card Pro development environment..."

# 1. Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node version
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# 2. Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm $(pnpm -v) detected"

# 3. Install dependencies
echo "📦 Installing project dependencies..."
pnpm install

# 4. Setup environment variables
if [ ! -f .env.local ]; then
    echo "⚙️  Setting up environment variables..."
    cp .env.example .env.local
    
    # Generate a random NextAuth secret
    if command -v openssl &> /dev/null; then
        secret=$(openssl rand -hex 32)
        sed -i.bak "s/development-secret-key-change-in-production/$secret/g" .env.local
        rm .env.local.bak
    fi
    
    echo "✅ Environment variables created in .env.local"
    echo "ℹ️  Please edit .env.local to configure your database and OAuth providers"
else
    echo "✅ Environment variables already configured"
fi

# 5. Setup database (using Docker)
echo "🐳 Setting up development database with Docker..."

if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker not found. You'll need to set up PostgreSQL manually."
    echo "   Or install Docker: https://docker.com/get-started"
else
    # Start development database
    docker compose -f docker-compose.dev.yml up -d
    
    # Wait for database to be ready
    echo "⏳ Waiting for database to be ready..."
    sleep 10
    
    # Generate Prisma client
    echo "⚙️  Generating Prisma client..."
    pnpm prisma generate
    
    # Run migrations
    echo "🗄️  Setting up database schema..."
    pnpm prisma db push
    
    # Seed database
    echo "🌱 Seeding database with sample data..."
    pnpm run db:seed
    
    echo "✅ Database setup complete"
fi

# 6. Setup Git hooks (if .git exists)
if [ -d .git ]; then
    echo "🪝 Setting up Git hooks..."
    # Add pre-commit hook for linting
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Run linting before commit
npm run lint
EOF
    chmod +x .git/hooks/pre-commit
    echo "✅ Git hooks configured"
fi

# 7. Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p public/icons
mkdir -p public/screenshots
mkdir -p backups
echo "✅ Directories created"

echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Edit .env.local with your configuration"
echo "  2. Start development server: pnpm dev"
echo "  3. Visit: http://localhost:3000"
echo ""
echo "🔗 Useful commands:"
echo "  - pnpm dev          # Start development server"
echo "  - pnpm build        # Build for production"
echo "  - pnpm lint         # Run ESLint"
echo "  - pnpm type-check   # Run TypeScript checks"
echo "  - pnpm db:studio    # Open Prisma Studio"
echo ""
echo "📚 Documentation:"
echo "  - Setup Guide: SETUP.md"
echo "  - API Docs: http://localhost:3000/api/docs (after starting)"
echo ""
echo "Happy coding! 🚀"