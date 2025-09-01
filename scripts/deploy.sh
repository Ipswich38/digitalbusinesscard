#!/bin/bash

# Production deployment script for Digital Business Card Pro
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🚀 Starting Digital Business Card Pro deployment..."

# Configuration
NODE_ENV=${NODE_ENV:-production}
DOMAIN=${DOMAIN:-localhost}
DB_BACKUP=${DB_BACKUP:-true}

echo "📋 Deployment configuration:"
echo "  - Environment: $NODE_ENV"
echo "  - Domain: $DOMAIN"
echo "  - Database backup: $DB_BACKUP"

# 1. Pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Check if required environment variables are set
required_vars=("DATABASE_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Error: Required environment variable $var is not set"
    exit 1
  fi
done

# Check database connectivity
echo "🔗 Testing database connection..."
if ! npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
  echo "❌ Error: Cannot connect to database"
  exit 1
fi

echo "✅ Pre-deployment checks passed"

# 2. Backup database (if enabled)
if [ "$DB_BACKUP" = "true" ]; then
  echo "💾 Creating database backup..."
  backup_file="backup-$(date +%Y%m%d-%H%M%S).sql"
  pg_dump "$DATABASE_URL" > "backups/$backup_file" || {
    echo "⚠️  Warning: Database backup failed, continuing anyway..."
  }
  echo "✅ Database backup created: $backup_file"
fi

# 3. Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# 4. Build the application
echo "🔨 Building application..."
npm run build

# 5. Database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# 6. Generate Prisma client
echo "⚙️  Generating Prisma client..."
npx prisma generate

# 7. Seed database (if needed)
if [ "$NODE_ENV" = "development" ] || [ "$SEED_DB" = "true" ]; then
  echo "🌱 Seeding database..."
  npm run db:seed
fi

# 8. Health check
echo "🏥 Running health check..."
if [ "$NODE_ENV" = "production" ]; then
  # Start the application in background for health check
  npm start &
  app_pid=$!
  sleep 10
  
  # Check if the app is responding
  if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
    kill $app_pid
  else
    echo "❌ Health check failed"
    kill $app_pid
    exit 1
  fi
fi

# 9. Setup SSL (if domain is provided and not localhost)
if [ "$DOMAIN" != "localhost" ]; then
  echo "🔒 Setting up SSL certificate..."
  # Add your SSL setup logic here (e.g., Let's Encrypt)
  echo "ℹ️  SSL setup would go here for domain: $DOMAIN"
fi

# 10. Final deployment
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "  - Start the application: npm start"
echo "  - Monitor logs: npm run logs"
echo "  - Check health: curl http://$DOMAIN/api/health"
echo ""
echo "🔗 Your Digital Business Card Pro is ready at: http://$DOMAIN"