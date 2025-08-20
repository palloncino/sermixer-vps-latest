#!/bin/bash

PDF_DIR="/var/www/pdfs"
ARCHIVE_DIR="/var/www/pdf-archives"
LOG_FILE="/var/www/server-v2.0/logs/pdf-archive.log"
TODAY=$(date +"%Y-%m-%d %H:%M:%S")
MONTH=$(date +"%Y-%m")

mkdir -p "$ARCHIVE_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

# Find PDFs older than 90 days
find "$PDF_DIR" -maxdepth 1 -type f -name "*.pdf" -mtime +90 | while read -r pdf; do
    base=$(basename "$pdf")
    # Add to monthly archive
    zip -mj "$ARCHIVE_DIR/pdfs-archive-$MONTH.zip" "$pdf"
    echo "[$TODAY] Archived $base" >> "$LOG_FILE"
done 