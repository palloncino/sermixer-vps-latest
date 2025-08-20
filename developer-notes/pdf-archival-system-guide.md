# PDF Archival System Guide

## Overview
This guide documents the PDF archival system implemented to manage PDF files in the Sermixer application. The system automatically archives PDFs older than 3 months while maintaining recent files in their original location.

## Directory Structure
- PDF Storage: `/var/www/sermixer/public/pdfs/`
- Archive Location: `/var/www/sermixer/public/pdfs/archive/`
- Log File: `/var/www/sermixer/storage/logs/pdf-archive.log`

## Components

### 1. Archival Script
Location: `/var/www/sermixer/app/Console/Commands/ArchiveOldPdfs.php`

This script handles the archival process with the following features:
- Moves PDFs older than 3 months to the archive directory
- Maintains original file names
- Logs all archival actions
- Preserves file permissions
- Handles errors gracefully

### 2. Cron Job
The archival process runs automatically via a cron job:

```bash
0 0 * * * cd /var/www/sermixer && php artisan pdf:archive >> /dev/null 2>&1
```

This runs the archival process daily at midnight.

## Usage

### Manual Archival
To manually trigger the archival process:
```bash
cd /var/www/sermixer
php artisan pdf:archive
```

### Checking Logs
To monitor archival activities:
```bash
tail -f /var/www/sermixer/storage/logs/pdf-archive.log
```

## File Retention Policy
- Files newer than 3 months remain in the main PDF directory
- Files older than 3 months are moved to the archive directory
- Archived files maintain their original names and timestamps

## Error Handling
- Failed archival attempts are logged with detailed error messages
- The system continues processing other files even if one file fails
- All errors are recorded in the log file for troubleshooting

## Maintenance
1. Regularly check the log file for any errors
2. Monitor disk space in both main and archive directories
3. Ensure proper permissions are maintained:
   ```bash
   sudo chown -R www-data:www-data /var/www/sermixer/public/pdfs
   sudo chmod -R 755 /var/www/sermixer/public/pdfs
   ```

## Troubleshooting
If files are not being archived:
1. Check the log file for errors
2. Verify cron job is running: `crontab -l`
3. Ensure proper permissions on directories
4. Verify PHP has write access to both directories

## Backup Considerations
- The archive directory is included in regular system backups
- Consider implementing a separate backup strategy for archived PDFs
- Monitor archive directory size and implement cleanup if necessary

## Security
- All PDF operations are logged for audit purposes
- File permissions are preserved during archival
- Access to archived files is restricted to authorized users

## Support
For issues or questions regarding the PDF archival system, contact the system administrator or refer to the application's technical documentation. 