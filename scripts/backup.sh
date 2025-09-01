#!/bin/bash

# Database backup script for Digital Business Card Pro
# Creates timestamped backups with optional compression and cleanup

set -e

# Configuration
BACKUP_DIR="backups"
MAX_BACKUPS=${MAX_BACKUPS:-7}  # Keep last 7 backups
COMPRESS=${COMPRESS:-true}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "💾 Starting database backup..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Create backup filename
if [ "$COMPRESS" = "true" ]; then
    BACKUP_FILE="$BACKUP_DIR/backup_${TIMESTAMP}.sql.gz"
    echo "📦 Creating compressed backup: $BACKUP_FILE"
    pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILE"
else
    BACKUP_FILE="$BACKUP_DIR/backup_${TIMESTAMP}.sql"
    echo "📄 Creating backup: $BACKUP_FILE"
    pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
fi

# Check if backup was successful
if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
    echo "✅ Backup created successfully: $BACKUP_FILE"
    
    # Get backup size
    backup_size=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "📏 Backup size: $backup_size"
else
    echo "❌ Error: Backup failed or is empty"
    exit 1
fi

# Cleanup old backups
if [ "$MAX_BACKUPS" -gt 0 ]; then
    echo "🧹 Cleaning up old backups (keeping last $MAX_BACKUPS)..."
    
    # Count current backups
    backup_count=$(find "$BACKUP_DIR" -name "backup_*.sql*" | wc -l)
    
    if [ "$backup_count" -gt "$MAX_BACKUPS" ]; then
        # Remove oldest backups
        find "$BACKUP_DIR" -name "backup_*.sql*" -type f -printf '%T@ %p\n' | \
        sort -n | \
        head -n -"$MAX_BACKUPS" | \
        cut -d' ' -f2- | \
        while read -r old_backup; do
            echo "🗑️  Removing old backup: $old_backup"
            rm "$old_backup"
        done
    fi
fi

# List current backups
echo ""
echo "📋 Current backups:"
ls -lah "$BACKUP_DIR"/backup_*.sql* 2>/dev/null || echo "No backups found"

echo ""
echo "🎉 Backup process completed!"
echo "💡 To restore a backup, use:"
echo "   gunzip -c $BACKUP_FILE | psql \$DATABASE_URL"