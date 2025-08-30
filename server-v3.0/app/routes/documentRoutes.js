import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import Document from "../models/document.js";
import Logger from "../utils/Logger.js";
import authMiddleware from "../utils/authMiddleware.js";
import { generateChangeLogs } from "../utils/changeLogs.js";
import {
  parseDocumentProperties,
  parseJSONIfNeeded,
} from "../utils/parseDocumentProperties.js";
import { initFollowUpState } from "../utils/staticFollowUp.js";
import { INITIAL_STATUSES } from "../utils/staticStatuses.js";

dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.remote" : ".env.local",
});

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.PDF_STORAGE_FOLDER_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto
      .randomBytes(4)
      .toString("hex")}`;
    cb(null, `preventive_docs-${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/create-document", authMiddleware, async (req, res) => {
  try {
    const {
      quoteHeadDetails,
      selectedClient,
      addedProducts,
      note,
      employeeID,
      discount,
      paymentTerms,
    } = req.body;

    // Process images to store URLs instead of base64
    const processedProducts = await processProductsImages(addedProducts);

    const newDocument = await Document.create({
      clientEmail: selectedClient.email,
      company: quoteHeadDetails.company,
      createdAt: new Date(),
      data: { 
        quoteHeadDetails, 
        selectedClient, 
        addedProducts: processedProducts,
        paymentTerms,
      },
      dateOfSignature: null,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      followUpSent: initFollowUpState,
      hash: uuidv4().slice(0, 8),
      revisions: [],
      note,
      otp: crypto.randomBytes(4).toString("hex"),
      readonly: false,
      status: INITIAL_STATUSES,
      updatedAt: new Date(),
      employeeID,
      discount,
    });

    res.status(201).json({ success: true, document: newDocument });
  } catch (error) {
    Logger.error("Error creating document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-all-documents", authMiddleware, async (req, res) => {
  try {
    const documents = await Document.findAll();
    if (documents) {
      const parsedDocuments = documents.map((doc) =>
        parseDocumentProperties(doc.toJSON())
      );
      res.json(parsedDocuments);
    } else {
      res.status(404).json({ error: "Documents not found" });
    }
  } catch (error) {
    Logger.error("Error fetching documents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete-documents", authMiddleware, async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid request, 'ids' must be a non-empty array." });
  }

  try {
    const deletedCount = await Document.destroy({ where: { id: ids } });

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "No documents found with the given IDs." });
    }

    res.status(200).json({
      ids,
      message: `${deletedCount} documents were successfully deleted.`,
    });
  } catch (error) {
    Logger.error("Error deleting documents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/reject-document/:hash", authMiddleware, async (req, res) => {
  try {
    const { hash } = req.params;

    // Find the document by hash
    const document = await Document.findOne({ where: { hash } });

    if (!document) {
      Logger.error(`Document with hash ${hash} not found.`);
      return res.status(404).json({ error: "Document not found" });
    }

    // Parse the status if it exists as a string
    let status = document.status;

    // If the status is a string, parse it to a JSON object
    if (typeof status === "string") {
      status = JSON.parse(status);
    }

    // Log current status before updating
    Logger.info(`Current document status before rejecting: ${JSON.stringify(status)}`);

    // Update the status to REJECTED and set readonly to true
    status.REJECTED = true; // Set the REJECTED status flag
    document.status = status; // Assign the updated status object
    document.readonly = true; // Mark the document as readonly

    // Save the updated document
    await document.save();

    Logger.info(`Document with hash ${hash} rejected successfully.`);
    res.json({
      success: true,
      document: parseDocumentProperties(document.toJSON()),
    });
  } catch (error) {
    Logger.error("Error rejecting document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/get-document/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const document = await Document.findOne({ where: { hash } });
    if (document) {
      const parsedDocument = parseDocumentProperties(document.toJSON());
      res.json(parsedDocument);
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (error) {
    Logger.error("Error fetching document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/save-document/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    
    // Accessing properties directly from req.body
    const { revision, actor, data, dateOfSignature, readonly, note, discount } = req.body;

    const document = await Document.findOne({ where: { hash } });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Ensure revisions is an array
    document.revisions = Array.isArray(document.revisions) ? document.revisions : JSON.parse(document.revisions || '[]');

    // Create a snapshot of the current document excluding revisions
    if (revision) {
      const snapshot = {
        id: uuidv4(), // Generate a unique ID for the revision
        label: revision.label,
        snapshot: JSON.parse(JSON.stringify(req.body.data)), // Serialize the data object
        createdAt: new Date(),
      };

      // Push the snapshot into the revisions array
      document.revisions.push(snapshot);
    }

    const now = new Date();
    const oldDocument = parseDocumentProperties({ ...document.toJSON() });
    const currentData = parseJSONIfNeeded(document.data);
    const newData = parseJSONIfNeeded(data);

    // Merge data
    const updatedData = { ...currentData, ...newData };
    const updatedDateOfSignature = dateOfSignature !== "" ? dateOfSignature : document.dateOfSignature;
    const updatedReadonly = readonly ?? document.readonly;
    const updatedNote = note ?? document.note;
    const updatedDiscount = discount ?? document.discount;

    // Update the status
    let status = parseJSONIfNeeded(document.status);

    if (actor.type === "client") {
      status.YOUR_TURN = true;
    } else {
      status.YOUR_TURN = false;
    }

    // Generate change logs
    const newDocument = parseDocumentProperties({
      ...document.toJSON(),
      data: updatedData,
      dateOfSignature: updatedDateOfSignature,
      readonly: updatedReadonly,
      note: updatedNote,
      discount: updatedDiscount,
      status, // Include the updated status
    });

    const changeLogs = generateChangeLogs(oldDocument, newDocument, now);

    // If no changes, return 404
    if (changeLogs.length === 0) {
      Logger.info(`No changes detected for document with hash: ${hash}`);
      return res.status(200).json({ success: false, message: "No changes detected." });
    }

    // Directly update the document using a query
    await Document.update(
      {
        data: updatedData,
        dateOfSignature: updatedDateOfSignature,
        readonly: updatedReadonly,
        note: updatedNote,
        discount: updatedDiscount,
        revisions: document.revisions, // Save the updated revisions array
        updatedAt: now,
        status: status, // Ensure status is updated and saved
      },
      { where: { hash } }
    );

    const savedDocument = await Document.findOne({ where: { hash } });

    Logger.info(`Document saved successfully with hash: ${hash}`);
    res.json({
      success: true,
      document: parseDocumentProperties(savedDocument.toJSON()),
    });
  } catch (error) {
    Logger.error("Error saving document:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

router.get("/client-viewed-document/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const document = await Document.findOne({ where: { hash } });

    if (!document) {
      Logger.error(`Document with hash ${hash} not found.`);
      return res.status(404).json({ error: "Document not found" });
    }

    let status = parseJSONIfNeeded(document.status);
    status.CLIENT_VIEWED_DOC = true;

    // Explicitly setting the status field
    await Document.update(
      { status, updatedAt: new Date() },
      { where: { hash } }
    );

    const updatedDocument = await Document.findOne({ where: { hash } });

    Logger.info(`Document status updated to CLIENT_VIEWED_DOC for hash: ${hash}`);
    res.json({
      success: true,
      document: parseDocumentProperties(updatedDocument.toJSON()),
    });
  } catch (error) {
    Logger.error("Error updating document status:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

router.get("/confirm-document/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const document = await Document.findOne({ where: { hash } });

    if (!document) {
      Logger.error(`Document with hash ${hash} not found.`);
      return res.status(404).json({ error: "Document not found" });
    }

    let status = parseJSONIfNeeded(document.status);
    status.FINALIZED = true;

    // Explicitly setting the status field
    await Document.update(
      { status, updatedAt: new Date() },
      { where: { hash } }
    );

    const updatedDocument = await Document.findOne({ where: { hash } });

    Logger.info(`Document status updated to FINALIZED for hash: ${hash}`);
    res.json({
      message: `Document ID: ${document.id} confirmed.`,
      success: true,
      document: parseDocumentProperties(updatedDocument.toJSON()),
    });
  } catch (error) {
    Logger.error("Error updating document status:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Function to process products and convert base64 images to URLs
async function processProductsImages(products) {
  return Promise.all(products.map(async product => {
    if (product.image && product.image.startsWith('data:image/')) {
      product.imgUrl = await saveImageAndGetUrl(product.image);
      delete product.image; // Remove base64 image
    }
    return product;
  }));
}

// Function to save image and return URL
async function saveImageAndGetUrl(base64Image) {
  // Logic to save the image to the file system and return the URL
  // Example: save to a specific folder and return the file path as URL
}

// PDF Status Management API Endpoints
router.get("/pdf-status/:filename", authMiddleware, async (req, res) => {
  try {
    const { filename } = req.params;
    const fs = await import('fs');
    const path = await import('path');
    
    // Check if PDF exists in current directory
    const currentPath = path.join(process.env.PDF_STORAGE_FOLDER_DIR, filename);
    if (fs.existsSync(currentPath)) {
      return res.json({
        status: 'available',
        location: 'current',
        path: currentPath,
        message: 'PDF is available in current directory'
      });
    }
    
    // Check if PDF exists in archives
    const archiveDir = '/var/www/pdf-archives';
    const archiveFiles = fs.readdirSync(archiveDir).filter(file => file.endsWith('.zip'));
    
    for (const archiveFile of archiveFiles) {
      const archivePath = path.join(archiveDir, archiveFile);
      try {
        // Use unzip -l to list contents without extracting
        const { execSync } = await import('child_process');
        const output = execSync(`unzip -l "${archivePath}" | grep "${filename}"`, { encoding: 'utf8' });
        if (output.trim()) {
          return res.json({
            status: 'archived',
            location: 'archive',
            archiveFile: archiveFile,
            path: archivePath,
            message: 'PDF is archived and can be retrieved'
          });
        }
      } catch (error) {
        // PDF not found in this archive, continue to next
        continue;
      }
    }
    
    // PDF not found anywhere
    res.json({
      status: 'missing',
      location: 'unknown',
      message: 'PDF not found in current directory or archives'
    });
    
  } catch (error) {
    Logger.error("Error checking PDF status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/pdf-retrieve/:filename", authMiddleware, async (req, res) => {
  try {
    const { filename } = req.params;
    const fs = await import('fs');
    const path = await import('path');
    
    // Check if PDF exists in current directory
    const currentPath = path.join(process.env.PDF_STORAGE_FOLDER_DIR, filename);
    if (fs.existsSync(currentPath)) {
      return res.sendFile(currentPath);
    }
    
    // Check if PDF exists in archives and extract it
    const archiveDir = '/var/www/pdf-archives';
    const archiveFiles = fs.readdirSync(archiveDir).filter(file => file.endsWith('.zip'));
    
    for (const archiveFile of archiveFiles) {
      const archivePath = path.join(archiveDir, archiveFile);
      try {
        // Check if file exists in archive
        const { execSync } = await import('child_process');
        const output = execSync(`unzip -l "${archivePath}" | grep "${filename}"`, { encoding: 'utf8' });
        if (output.trim()) {
          // Extract the specific file to a temporary location
          const tempDir = '/tmp/pdf-retrieval';
          fs.mkdirSync(tempDir, { recursive: true });
          
          execSync(`unzip -j "${archivePath}" "${filename}" -d "${tempDir}"`);
          const extractedPath = path.join(tempDir, filename);
          
          // Send the file and then clean up
          res.sendFile(extractedPath, (err) => {
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
    
    res.status(404).json({ error: "PDF not found" });
    
  } catch (error) {
    Logger.error("Error retrieving PDF:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/pdf-list", authMiddleware, async (req, res) => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const currentDir = process.env.PDF_STORAGE_FOLDER_DIR;
    const archiveDir = '/var/www/pdf-archives';
    
    // Get current PDFs
    const currentPdfs = fs.readdirSync(currentDir)
      .filter(file => file.endsWith('.pdf'))
      .map(filename => ({
        filename,
        status: 'available',
        location: 'current',
        path: path.join(currentDir, filename),
        size: fs.statSync(path.join(currentDir, filename)).size,
        modified: fs.statSync(path.join(currentDir, filename)).mtime
      }));
    
    // Get archived PDFs
    const archivedPdfs = [];
    if (fs.existsSync(archiveDir)) {
      const archiveFiles = fs.readdirSync(archiveDir).filter(file => file.endsWith('.zip'));
      
      for (const archiveFile of archiveFiles) {
        try {
          const { execSync } = await import('child_process');
          const output = execSync(`unzip -l "${path.join(archiveDir, archiveFile)}"`, { encoding: 'utf8' });
          
          // Parse unzip output to extract PDF filenames
          const lines = output.split('\n');
          for (const line of lines) {
            if (line.includes('.pdf')) {
              const match = line.match(/\s+(\d+)\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+(.+\.pdf)/);
              if (match) {
                archivedPdfs.push({
                  filename: match[3],
                  status: 'archived',
                  location: 'archive',
                  archiveFile: archiveFile,
                  size: parseInt(match[1]),
                  archived: match[2]
                });
              }
            }
          }
        } catch (error) {
          Logger.error(`Error reading archive ${archiveFile}:`, error);
        }
      }
    }
    
    res.json({
      current: currentPdfs,
      archived: archivedPdfs,
      total: currentPdfs.length + archivedPdfs.length
    });
    
  } catch (error) {
    Logger.error("Error listing PDFs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
