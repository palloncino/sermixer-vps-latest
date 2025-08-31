import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import Document from "../models/document.js";
import Logger from "../utils/Logger.js";
import authMiddleware from "../utils/authMiddleware.js";
import { computeFinalPrices } from "../utils/computeFinalPrices.js"; // Import the new function
import { generatePDF, generateHTMLPreview } from "../utils/generatePDF.js";
import { formatDateForFilename } from "../utils/formatDateForFilename.js";
import { safelyParseJSON } from "../utils/safelyParseJSON.js";
import slugify from "slugify";

const envPath =
  process.env.NODE_ENV === "production" ? ".env.remote" : ".env.local";
dotenv.config({ path: envPath });

const router = express.Router();

router.post("/create-quote/:hash", authMiddleware, async (req, res) => {
  const { hash } = req.params;
  // Never trust client employeeID/createdAt - use server-side authentication
  const userId = req.user?.id; 
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Shallow clone to avoid mutating req.body in place
  const incoming = { ...req.body };
  const isConfirmation = incoming.type && incoming.type !== "default";

  try {

    // Find the document by hash
    const document = await Document.findOne({ where: { hash } });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Server-authoritative dates & ids
    const issuedDate = document.createdAt;
    const expiryDate = document.expiresAt;
    const quoteNumber = String(document.id);

    // Ensure dateOfSignature is set (server side)
    const dateOfSignature =
      incoming.dateOfSignature ??
      new Date().toISOString().split(".")[0] + "Z";

    const {
      TOTAL_BASE_PRICE,
      TOTAL_ACCESSORIES,
      TOTAL_ALL,
      TOTAL_BASE_PRICE_DISCOUNTED,
      TOTAL_ACCESSORIES_DISCOUNTED,
      TOTAL_ALL_DISCOUNTED,
      TOTAL_WITH_DISCOUNT,
      ALL_PRICE_RECORDS,
      TOTAL_ALL_WITH_TAXES,
    } = computeFinalPrices(incoming.data.addedProducts, incoming.discount);

    // Prefer rate from payload/company default if applicable
    const resolvedTaxRate = incoming.data?.taxRate ?? 0.22;

    // Generate PDF with server-trusted values
    const pdfBuffer = await generatePDF({
      ...incoming,
      // overwrite with server-trusted fields
      quoteNumber,
      issuedDate,
      expiryDate,
      dateOfSignature,
      company: incoming.company,
      object: incoming.data?.quoteHeadDetails?.object,
      description: incoming.data?.quoteHeadDetails?.description,
      TOTAL_BASE_PRICE,
      TOTAL_ACCESSORIES,
      TOTAL_ALL,
      TOTAL_BASE_PRICE_DISCOUNTED,
      TOTAL_ACCESSORIES_DISCOUNTED,
      TOTAL_ALL_DISCOUNTED,
      TOTAL_WITH_DISCOUNT,
      ALL_PRICE_RECORDS,
      taxRate: resolvedTaxRate,
      TOTAL_ALL_WITH_TAXES,
    }, isConfirmation);

    // New naming system: HASH-MM-DD_HH-MM-SS-COMPANY-TYPE.pdf
    const companyCode = String(document.company).toLowerCase() === 'sermixer' ? 'SE' : 'S2';
    const typeCode = isConfirmation ? 'CON' : 'PRE';
    const filename = `${quoteNumber}-${formatDateForFilename(new Date())}-${companyCode}-${typeCode}.pdf`;

    const storageDir = process.env.PDF_STORAGE_FOLDER_DIR;
    if (!storageDir) {
      Logger.error("PDF_STORAGE_FOLDER_DIR not configured");
      return res.status(500).json({ message: "Storage path not configured" });
    }

    const filePath = path.join(storageDir, filename);
    await fs.promises.mkdir(storageDir, { recursive: true });
    await fs.promises.writeFile(filePath, pdfBuffer);

    // Build URL from request when possible (behind proxies)
    const proto = (req.headers["x-forwarded-proto"]) || req.protocol;
    const host = req.get("host");
    
    // Ensure the port is included if missing
    let hostWithPort = host;
    if (host && !host.includes(':') && process.env.CUSTOM_HTTP_PORT) {
      hostWithPort = `${host}:${process.env.CUSTOM_HTTP_PORT}`;
    }
    const baseUrlFromReq = hostWithPort ? `${proto}://${hostWithPort}` : null;

    const pdfUrl =
      baseUrlFromReq
        ? `${baseUrlFromReq}/pdfs/${filename}`
        : `${process.env.BASE_URL}${process.env.CUSTOM_HTTP_PORT ? ":" + process.env.CUSTOM_HTTP_PORT : ""}/pdfs/${filename}`;

    const pdfEntry = {
      name: filename,
      url: pdfUrl,
      timestamp: new Date().toISOString(),
      revision: undefined,
    };

    // Normalize existing pdfUrls to array - always use JSON format for consistency
    const existing = Array.isArray(document.pdfUrls)
      ? document.pdfUrls
      : safelyParseJSON(document.pdfUrls) || [];

    pdfEntry.revision = existing.length + 1;
    const next = [...existing, pdfEntry];

    // Always store as JSON string for consistency between dev and prod
    await document.update({ pdfUrls: JSON.stringify(next) });

    const updatedDocument = await Document.findOne({ where: { hash } });

    res.status(201).json({
      message: "Quote created and PDF generated and stored successfully!",
      document: updatedDocument,
    });
  } catch (error) {
    Logger.error(`Error creating quote: ${error.message}`, { 
      stack: error.stack,
      hash,
      userId,
      isConfirmation 
    });
    
    // More specific error handling
    let statusCode = 500;
    let message = "Internal server error";
    
    if (error.message.includes("Document not found")) {
      statusCode = 404;
      message = "Document not found";
    } else if (error.message.includes("Unauthorized") || error.message.includes("Permission denied")) {
      statusCode = 401;
      message = "Unauthorized access";
    } else if (error.message.includes("PDF generation failed") || error.message.includes("Puppeteer")) {
      statusCode = 500;
      message = "PDF generation failed";
    } else if (error.message.includes("Storage") || error.message.includes("ENOENT")) {
      statusCode = 500;
      message = "File storage error";
    }
    
    res.status(statusCode).json({ 
      message,
      error: process.env.NODE_ENV === "development" ? {
        details: error.message,
        stack: error.stack
      } : {
        details: error.message
      }
    });
  }
});

// Route for HTML preview (new feature for live editing) - GET route for browser access
router.get("/preview-html/:hash", async (req, res) => {
  const { hash } = req.params;
  
  // Optional query parameters for customization
  const isConfirmation = req.query.type === "confirmation";

  try {
    // Find the document by hash
    const document = await Document.findOne({ where: { hash } });

    if (!document) {
      return res.status(404).send(`
        <html>
          <body style="font-family: Arial; padding: 20px;">
            <h1>Document Not Found</h1>
            <p>The document with hash <code>${hash}</code> was not found.</p>
          </body>
        </html>
      `);
    }

    // Server-authoritative dates & ids (same as PDF route)
    const issuedDate = document.createdAt;
    const expiryDate = document.expiresAt;
    const quoteNumber = String(document.id);

    // Use current date for signature
    const dateOfSignature = new Date().toISOString().split(".")[0] + "Z";

    // Use document data as-is (no overrides from request body since it's GET)
    const quote = {
      ...document.dataValues,
      data: document.data,
      quoteNumber,
      issuedDate,
      expiryDate,
      dateOfSignature,
      company: document.company || "Sermixer",
      clientEmail: document.clientEmail,
      discount: document.discount ?? 0,
    };

    // Compute final prices - same as PDF route
    const {
      TOTAL_ALL,
      TOTAL_ALL_DISCOUNTED,
      TOTAL_WITH_DISCOUNT,
      TOTAL_ALL_WITH_TAXES,
    } = computeFinalPrices(quote.data.addedProducts, quote.discount);

    const finalQuote = {
      ...quote,
      TOTAL_ALL,
      TOTAL_ALL_DISCOUNTED,
      TOTAL_WITH_DISCOUNT,
      TOTAL_ALL_WITH_TAXES,
    };

    console.log("HTML Preview Generation:", {
      quoteNumber: finalQuote.quoteNumber,
      isConfirmation,
      company: finalQuote.company
    });

    // Generate HTML preview
    const htmlContent = await generateHTMLPreview(finalQuote, isConfirmation);

    // Return HTML with proper content type
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(htmlContent);

  } catch (error) {
    Logger.error(`Error generating HTML preview: ${error.message}`, { 
      stack: error.stack,
      hash,
      isConfirmation 
    });
    
    res.status(500).send(`
      <html>
        <body style="font-family: Arial; padding: 20px; background-color: #ffebee;">
          <h1 style="color: #c62828;">HTML Preview Generation Failed</h1>
          <p><strong>Error:</strong> ${error.message}</p>
          ${process.env.NODE_ENV === "development" ? `
          <details>
            <summary>Stack Trace (Development)</summary>
            <pre style="background: #f5f5f5; padding: 10px; overflow: auto;">${error.stack}</pre>
          </details>
          ` : ''}
        </body>
      </html>
    `);
  }
});

export default router;
