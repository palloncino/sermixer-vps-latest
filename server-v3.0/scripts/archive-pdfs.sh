#!/bin/bash

# Configuration
# Check for required commands
command -v zip >/dev/null 2>&1 || { echo >&2 "zip package required but not installed. Run: sudo apt-get install zip"; exit 1; }
command -v unzip >/dev/null 2>&1 || { echo >&2 "unzip package required but not installed. Run: sudo apt-get install unzip"; exit 1; }

SOURCE_DIR="/var/www/pdfs"
ARCHIVE_DIR="/var/www/pdf-archives"
LOG_FILE="/var/www/server-v2.0/logs/pdf-archive.log"
DAYS_OLD=60  # PDFs older than 60 days
DATE=$(date +%Y-%m)

# Ensure archive directory exists
mkdir -p "$ARCHIVE_DIR"

# Create archive for this month
ARCHIVE_NAME="pdfs-archive-$DATE.zip"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Find and archive PDFs older than 60 days
find "$SOURCE_DIR" -name "*.pdf" -type f -mtime +$DAYS_OLD | while read pdf; do
    filename=$(basename "$pdf")
    
    # Add to zip archive
    zip -j "$ARCHIVE_DIR/$ARCHIVE_NAME" "$pdf"
    
    if [ $? -eq 0 ]; then
        # Remove original file if successfully archived
        rm "$pdf"
        log_message "Archived and removed: $filename"
    else
        log_message "Failed to archive: $filename"
    fi
done

# Calculate statistics
ARCHIVE_SIZE=$(du -h "$ARCHIVE_DIR/$ARCHIVE_NAME" 2>/dev/null | cut -f1)
TOTAL_FILES=$(unzip -l "$ARCHIVE_DIR/$ARCHIVE_NAME" 2>/dev/null | tail -1 | awk '{print $2}')

# Log summary
log_message "Archive completed: $ARCHIVE_NAME"
log_message "Total files archived: $TOTAL_FILES"
log_message "Archive size: $ARCHIVE_SIZE"

# Cleanup old archives (keep last 6 months)
find "$ARCHIVE_DIR" -name "pdfs-archive-*.zip" -type f -mtime +180 -delete

# Check disk space after archival
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    log_message "WARNING: Disk usage is at ${DISK_USAGE}%"
fi 