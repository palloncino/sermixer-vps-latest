import express from "express";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import Logger from "../utils/Logger.js";
import authMiddleware from "../utils/authMiddleware.js";

const router = express.Router();

// Test endpoint without auth (for development only)
router.get("/test", async (req, res) => {
  try {
    res.json({ 
      message: "PDF routes are working!",
      timestamp: new Date().toISOString(),
      server: "v3.0"
    });
  } catch (error) {
    res.status(500).json({ error: "Test endpoint failed" });
  }
});

// Get disk space information (development version without auth)
router.get("/disk-space-test", async (req, res) => {
  try {
    // Get disk usage for the PDF storage directory
    const pdfDir = process.env.PDF_STORAGE_FOLDER_DIR || '/var/www/pdfs';
    const archiveDir = '/var/www/pdf-archives';
    
    // Get total disk space and usage
    const diskOutput = execSync(`df -h ${pdfDir}`, { encoding: 'utf8' });
    const diskLines = diskOutput.trim().split('\n');
    const diskInfo = diskLines[1].split(/\s+/);
    
    // Get PDF directory size
    let pdfDirSize = 0;
    try {
      const pdfSizeOutput = execSync(`du -sb ${pdfDir}`, { encoding: 'utf8' });
      pdfDirSize = parseInt(pdfSizeOutput.split('\t')[0]);
    } catch (error) {
      Logger.warn("Could not get PDF directory size:", error.message);
    }
    
    // Get archive directory size
    let archiveDirSize = 0;
    if (fs.existsSync(archiveDir)) {
      try {
        const archiveSizeOutput = execSync(`du -sb ${archiveDir}`, { encoding: 'utf8' });
        archiveDirSize = parseInt(archiveSizeOutput.split('\t')[0]);
      } catch (error) {
        Logger.warn("Could not get archive directory size:", error.message);
      }
    }
    
    res.json({
      disk: {
        total: diskInfo[1],
        used: diskInfo[2],
        available: diskInfo[3],
        usagePercent: diskInfo[4]
      },
      pdf: {
        currentSize: pdfDirSize,
        archiveSize: archiveDirSize,
        totalPdfSize: pdfDirSize + archiveDirSize
      }
    });
    
  } catch (error) {
    Logger.error("Error getting disk space:", error);
    res.status(500).json({ error: "Failed to get disk space information" });
  }
});

// Get disk space information
router.get("/disk-space", authMiddleware, async (req, res) => {
  try {
    // Get disk usage for the PDF storage directory
    const pdfDir = process.env.PDF_STORAGE_FOLDER_DIR || '/var/www/pdfs';
    const archiveDir = '/var/www/pdf-archives';
    
    // Get total disk space and usage
    const diskOutput = execSync(`df -h ${pdfDir}`, { encoding: 'utf8' });
    const diskLines = diskOutput.trim().split('\n');
    const diskInfo = diskLines[1].split(/\s+/);
    
    // Get PDF directory size
    let pdfDirSize = 0;
    try {
      const pdfSizeOutput = execSync(`du -sb ${pdfDir}`, { encoding: 'utf8' });
      pdfDirSize = parseInt(pdfSizeOutput.split('\t')[0]);
    } catch (error) {
      Logger.warn("Could not get PDF directory size:", error.message);
    }
    
    // Get archive directory size
    let archiveDirSize = 0;
    if (fs.existsSync(archiveDir)) {
      try {
        const archiveSizeOutput = execSync(`du -sb ${archiveDir}`, { encoding: 'utf8' });
        archiveDirSize = parseInt(archiveSizeOutput.split('\t')[0]);
      } catch (error) {
        Logger.warn("Could not get archive directory size:", error.message);
      }
    }
    
    res.json({
      disk: {
        total: diskInfo[1],
        used: diskInfo[2],
        available: diskInfo[3],
        usagePercent: diskInfo[4]
      },
      pdf: {
        currentSize: pdfDirSize,
        archiveSize: archiveDirSize,
        totalPdfSize: pdfDirSize + archiveDirSize
      }
    });
    
  } catch (error) {
    Logger.error("Error getting disk space:", error);
    res.status(500).json({ error: "Failed to get disk space information" });
  }
});

// List all PDFs with detailed information (test version without auth)
router.get("/list-test", async (req, res) => {
  try {
    const currentDir = process.env.PDF_STORAGE_FOLDER_DIR || '/var/www/pdfs';
    const archiveDir = '/var/www/pdf-archives';
    const now = new Date();
    
    // Get current PDFs with detailed info
    const currentPdfs = [];
    if (fs.existsSync(currentDir)) {
      const files = fs.readdirSync(currentDir).filter(file => file.endsWith('.pdf'));
      
      for (const filename of files) { // Show all files
        try {
          const filePath = path.join(currentDir, filename);
          const stats = fs.statSync(filePath);
          const ageInDays = Math.floor((now - stats.mtime) / (1000 * 60 * 60 * 24));
          
          // Determine age category for color coding
          let ageCategory = 'white'; // < 1 week
          if (ageInDays >= 7 && ageInDays < 60) {
            ageCategory = 'lightGrey'; // 1 week to 2 months
          } else if (ageInDays >= 60 && ageInDays < 90) {
            ageCategory = 'darkGrey'; // 2 to 3 months
          } else if (ageInDays >= 90 && ageInDays < 180) {
            ageCategory = 'greyOrange'; // 3 to 6 months
          } else if (ageInDays >= 180) {
            ageCategory = 'reddish'; // > 6 months
          }
          
          currentPdfs.push({
            filename,
            status: 'current',
            location: 'current',
            path: filePath,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            ageInDays,
            ageCategory,
            sizeFormatted: formatBytes(stats.size)
          });
        } catch (error) {
          Logger.warn(`Error reading file ${filename}:`, error.message);
        }
      }
    }
    
    res.json({
      pdfs: currentPdfs,
      summary: {
        total: currentPdfs.length,
        current: currentPdfs.length,
        archived: 0,
        totalSize: currentPdfs.reduce((sum, pdf) => sum + pdf.size, 0),
        totalSizeFormatted: formatBytes(currentPdfs.reduce((sum, pdf) => sum + pdf.size, 0))
      },
      note: "Test endpoint - showing all current PDFs"
    });
    
  } catch (error) {
    Logger.error("Error listing PDFs:", error);
    res.status(500).json({ error: "Failed to list PDFs" });
  }
});

// List all PDFs with detailed information
router.get("/list", authMiddleware, async (req, res) => {
  try {
    const currentDir = process.env.PDF_STORAGE_FOLDER_DIR || '/var/www/pdfs';
    const archiveDir = '/var/www/pdf-archives';
    const now = new Date();
    
    // Get current PDFs with detailed info
    const currentPdfs = [];
    if (fs.existsSync(currentDir)) {
      const files = fs.readdirSync(currentDir).filter(file => file.endsWith('.pdf'));
      
      for (const filename of files) {
        try {
          const filePath = path.join(currentDir, filename);
          const stats = fs.statSync(filePath);
          const ageInDays = Math.floor((now - stats.mtime) / (1000 * 60 * 60 * 24));
          
          // Determine age category for color coding
          let ageCategory = 'white'; // < 1 week
          if (ageInDays >= 7 && ageInDays < 60) {
            ageCategory = 'lightGrey'; // 1 week to 2 months
          } else if (ageInDays >= 60 && ageInDays < 90) {
            ageCategory = 'darkGrey'; // 2 to 3 months
          } else if (ageInDays >= 90 && ageInDays < 180) {
            ageCategory = 'greyOrange'; // 3 to 6 months
          } else if (ageInDays >= 180) {
            ageCategory = 'reddish'; // > 6 months
          }
          
          currentPdfs.push({
            filename,
            status: 'current',
            location: 'current',
            path: filePath,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            ageInDays,
            ageCategory,
            sizeFormatted: formatBytes(stats.size)
          });
        } catch (error) {
          Logger.warn(`Error reading file ${filename}:`, error.message);
        }
      }
    }
    
    // Get archived PDFs
    const archivedPdfs = [];
    if (fs.existsSync(archiveDir)) {
      const archiveFiles = fs.readdirSync(archiveDir).filter(file => file.endsWith('.zip'));
      
      for (const archiveFile of archiveFiles) {
        try {
          const archivePath = path.join(archiveDir, archiveFile);
          const archiveStats = fs.statSync(archivePath);
          const output = execSync(`unzip -l "${archivePath}"`, { encoding: 'utf8' });
          
          // Parse unzip output to extract PDF filenames
          const lines = output.split('\n');
          for (const line of lines) {
            if (line.includes('.pdf')) {
              const match = line.match(/\s+(\d+)\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+(.+\.pdf)/);
              if (match) {
                const fileSize = parseInt(match[1]);
                const archivedDate = new Date(match[2]);
                const ageInDays = Math.floor((now - archivedDate) / (1000 * 60 * 60 * 24));
                
                // All archived files are considered old (reddish)
                const ageCategory = 'reddish';
                
                archivedPdfs.push({
                  filename: match[3],
                  status: 'archived',
                  location: 'archive',
                  archiveFile: archiveFile,
                  archivePath: archivePath,
                  size: fileSize,
                  archived: archivedDate,
                  ageInDays,
                  ageCategory,
                  sizeFormatted: formatBytes(fileSize)
                });
              }
            }
          }
        } catch (error) {
          Logger.error(`Error reading archive ${archiveFile}:`, error);
        }
      }
    }
    
    // Sort by creation/modification date (newest first)
    currentPdfs.sort((a, b) => {
      return new Date(b.modified) - new Date(a.modified);
    });
    
    res.json({
      pdfs: currentPdfs,
      summary: {
        total: currentPdfs.length,
        current: currentPdfs.length,
        archived: 0,
        totalSize: currentPdfs.reduce((sum, pdf) => sum + pdf.size, 0),
        totalSizeFormatted: formatBytes(currentPdfs.reduce((sum, pdf) => sum + pdf.size, 0))
      }
    });
    
  } catch (error) {
    Logger.error("Error listing PDFs:", error);
    res.status(500).json({ error: "Failed to list PDFs" });
  }
});

// Download a PDF (current or archived)
router.get("/download/:filename", authMiddleware, async (req, res) => {
  try {
    const { filename } = req.params;
    const currentDir = process.env.PDF_STORAGE_FOLDER_DIR || '/var/www/pdfs';
    const archiveDir = '/var/www/pdf-archives';
    
    // Check if PDF exists in current directory
    const currentPath = path.join(currentDir, filename);
    if (fs.existsSync(currentPath)) {
      Logger.info(`Downloading current PDF: ${filename}`);
      return res.download(currentPath, filename);
    }
    
    // Check if PDF exists in archives and extract it
    if (fs.existsSync(archiveDir)) {
      const archiveFiles = fs.readdirSync(archiveDir).filter(file => file.endsWith('.zip'));
      
      for (const archiveFile of archiveFiles) {
        const archivePath = path.join(archiveDir, archiveFile);
        try {
          // Check if file exists in archive
          const output = execSync(`unzip -l "${archivePath}" | grep "${filename}"`, { encoding: 'utf8' });
          if (output.trim()) {
            // Extract the specific file to a temporary location
            const tempDir = '/tmp/pdf-retrieval';
            fs.mkdirSync(tempDir, { recursive: true });
            
            execSync(`unzip -j "${archivePath}" "${filename}" -d "${tempDir}"`);
            const extractedPath = path.join(tempDir, filename);
            
            Logger.info(`Downloading archived PDF: ${filename} from ${archiveFile}`);
            
            // Send the file and then clean up
            res.download(extractedPath, filename, (err) => {
              if (err) {
                Logger.error("Error sending extracted PDF:", err);
              }
              // Clean up temp file
              try {
                fs.unlinkSync(extractedPath);
              } catch (cleanupError) {
                Logger.error("Error cleaning up temp file:", cleanupError);
              }
            });
            return;
          }
        } catch (error) {
          continue;
        }
      }
    }
    
    res.status(404).json({ error: "PDF not found" });
    
  } catch (error) {
    Logger.error("Error downloading PDF:", error);
    res.status(500).json({ error: "Failed to download PDF" });
  }
});

// Delete PDFs (current only, archived files cannot be individually deleted)
router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    const { filenames } = req.body;
    
    if (!Array.isArray(filenames) || filenames.length === 0) {
      return res.status(400).json({ error: "Invalid request, 'filenames' must be a non-empty array" });
    }
    
    const currentDir = process.env.PDF_STORAGE_FOLDER_DIR || '/var/www/pdfs';
    const results = [];
    let deletedCount = 0;
    let deletedSize = 0;
    
    for (const filename of filenames) {
      try {
        const filePath = path.join(currentDir, filename);
        
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          fs.unlinkSync(filePath);
          
          results.push({
            filename,
            status: 'deleted',
            size: stats.size,
            sizeFormatted: formatBytes(stats.size)
          });
          
          deletedCount++;
          deletedSize += stats.size;
          
          Logger.info(`Deleted PDF: ${filename} (${formatBytes(stats.size)})`);
        } else {
          results.push({
            filename,
            status: 'not_found',
            message: 'File not found in current directory'
          });
        }
      } catch (error) {
        Logger.error(`Error deleting ${filename}:`, error);
        results.push({
          filename,
          status: 'error',
          message: error.message
        });
      }
    }
    
    res.json({
      success: true,
      results,
      summary: {
        total: filenames.length,
        deleted: deletedCount,
        totalSizeDeleted: deletedSize,
        totalSizeDeletedFormatted: formatBytes(deletedSize)
      }
    });
    
  } catch (error) {
    Logger.error("Error deleting PDFs:", error);
    res.status(500).json({ error: "Failed to delete PDFs" });
  }
});

// Get PDF statistics by age category (test version without auth)
router.get("/stats-test", async (req, res) => {
  try {
    const currentDir = process.env.PDF_STORAGE_FOLDER_DIR || '/var/www/pdfs';
    const now = new Date();
    
    const stats = {
      white: { count: 0, size: 0 },      // < 1 week
      lightGrey: { count: 0, size: 0 },  // 1 week to 2 months
      darkGrey: { count: 0, size: 0 },   // 2 to 3 months
      greyOrange: { count: 0, size: 0 }, // 3 to 6 months
      reddish: { count: 0, size: 0 }     // > 6 months
    };
    
    // Process current PDFs (showing all files)
    if (fs.existsSync(currentDir)) {
      const files = fs.readdirSync(currentDir).filter(file => file.endsWith('.pdf'));
      
      for (const filename of files) {
        try {
          const filePath = path.join(currentDir, filename);
          const fileStats = fs.statSync(filePath);
          const ageInDays = Math.floor((now - fileStats.mtime) / (1000 * 60 * 60 * 24));
          
          let category = 'white';
          if (ageInDays >= 7 && ageInDays < 60) {
            category = 'lightGrey';
          } else if (ageInDays >= 60 && ageInDays < 90) {
            category = 'darkGrey';
          } else if (ageInDays >= 90 && ageInDays < 180) {
            category = 'greyOrange';
          } else if (ageInDays >= 180) {
            category = 'reddish';
          }
          
          stats[category].count++;
          stats[category].size += fileStats.size;
        } catch (error) {
          Logger.warn(`Error processing file ${filename}:`, error.message);
        }
      }
    }
    
    // Format sizes
    Object.keys(stats).forEach(category => {
      stats[category].sizeFormatted = formatBytes(stats[category].size);
    });
    
    res.json({
      stats,
      total: {
        count: Object.values(stats).reduce((sum, cat) => sum + cat.count, 0),
        size: Object.values(stats).reduce((sum, cat) => sum + cat.size, 0),
        sizeFormatted: formatBytes(Object.values(stats).reduce((sum, cat) => sum + cat.size, 0))
      },
      note: "Test endpoint - showing all PDF statistics"
    });
    
  } catch (error) {
    Logger.error("Error getting PDF stats:", error);
    res.status(500).json({ error: "Failed to get PDF statistics" });
  }
});

// Get PDF statistics by age category
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const currentDir = process.env.PDF_STORAGE_FOLDER_DIR || '/var/www/pdfs';
    const archiveDir = '/var/www/pdf-archives';
    const now = new Date();
    
    const stats = {
      white: { count: 0, size: 0 },      // < 1 week
      lightGrey: { count: 0, size: 0 },  // 1 week to 2 months
      darkGrey: { count: 0, size: 0 },   // 2 to 3 months
      greyOrange: { count: 0, size: 0 }, // 3 to 6 months
      reddish: { count: 0, size: 0 }     // > 6 months
    };
    
    // Process current PDFs
    if (fs.existsSync(currentDir)) {
      const files = fs.readdirSync(currentDir).filter(file => file.endsWith('.pdf'));
      
      for (const filename of files) {
        try {
          const filePath = path.join(currentDir, filename);
          const fileStats = fs.statSync(filePath);
          const ageInDays = Math.floor((now - fileStats.mtime) / (1000 * 60 * 60 * 24));
          
          let category = 'white';
          if (ageInDays >= 7 && ageInDays < 60) {
            category = 'lightGrey';
          } else if (ageInDays >= 60 && ageInDays < 90) {
            category = 'darkGrey';
          } else if (ageInDays >= 90 && ageInDays < 180) {
            category = 'greyOrange';
          } else if (ageInDays >= 180) {
            category = 'reddish';
          }
          
          stats[category].count++;
          stats[category].size += fileStats.size;
        } catch (error) {
          Logger.warn(`Error processing file ${filename}:`, error.message);
        }
      }
    }
    
    // Process archived PDFs (all considered reddish)
    if (fs.existsSync(archiveDir)) {
      const archiveFiles = fs.readdirSync(archiveDir).filter(file => file.endsWith('.zip'));
      
      for (const archiveFile of archiveFiles) {
        try {
          const archivePath = path.join(archiveDir, archiveFile);
          const output = execSync(`unzip -l "${archivePath}"`, { encoding: 'utf8' });
          
          const lines = output.split('\n');
          for (const line of lines) {
            if (line.includes('.pdf')) {
              const match = line.match(/\s+(\d+)\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+(.+\.pdf)/);
              if (match) {
                const fileSize = parseInt(match[1]);
                stats.reddish.count++;
                stats.reddish.size += fileSize;
              }
            }
          }
        } catch (error) {
          Logger.error(`Error reading archive ${archiveFile}:`, error);
        }
      }
    }
    
    // Format sizes
    Object.keys(stats).forEach(category => {
      stats[category].sizeFormatted = formatBytes(stats[category].size);
    });
    
    res.json({
      stats,
      total: {
        count: Object.values(stats).reduce((sum, cat) => sum + cat.count, 0),
        size: Object.values(stats).reduce((sum, cat) => sum + cat.size, 0),
        sizeFormatted: formatBytes(Object.values(stats).reduce((sum, cat) => sum + cat.size, 0))
      }
    });
    
  } catch (error) {
    Logger.error("Error getting PDF stats:", error);
    res.status(500).json({ error: "Failed to get PDF statistics" });
  }
});

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default router;
