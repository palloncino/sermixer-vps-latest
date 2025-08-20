import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import Document from "../models/document.js";
import Logger from "../utils/Logger.js";
import authMiddleware from "../utils/authMiddleware.js";
import { computeFinalPrices } from "../utils/computeFinalPrices.js"; // Import the new function
import { generatePDF } from "../utils/generatePDF.js";
import { formatDateForFilename } from "../utils/formatDateForFilename.js";
import { safelyParseJSON } from "../utils/safelyParseJSON.js";

const envPath =
  process.env.NODE_ENV === "production" ? ".env.remote" : ".env.local";
dotenv.config({ path: envPath });

const router = express.Router();

router.post("/create-quote/:hash", authMiddleware, async (req, res) => {
  const { hash } = req.params;
  const documentData = req.body;
  const isConfirmation = documentData.type !== 'default';
  if (documentData.dateOfSignature === null) {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('.')[0] + "Z";
    documentData.dateOfSignature = formattedDate;
  }

  try {
    const userId = req.body.employeeID; // Retrieve userId from req.body.employeeID

    if (!userId) {
      return res.status(400).json({ message: "employeeID is required" });
    }

    // Find the document by hash
    const document = await Document.findOne({ where: { hash } });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

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
    } = computeFinalPrices(documentData.data.addedProducts, documentData.discount);

    // Generate PDF
    const pdfBuffer = await generatePDF({
      ...documentData,
      quoteNumber: `${document.id}`,
      company: documentData.company,
      object: documentData.data.quoteHeadDetails.object,
      description: documentData.data.quoteHeadDetails.description,
      issuedDate: document.createdAt,
      expiryDate: document.expiresAt,
      TOTAL_BASE_PRICE,
      TOTAL_ACCESSORIES,
      TOTAL_ALL,
      TOTAL_BASE_PRICE_DISCOUNTED,
      TOTAL_ACCESSORIES_DISCOUNTED,
      TOTAL_ALL_DISCOUNTED,
      TOTAL_WITH_DISCOUNT,
      ALL_PRICE_RECORDS,
      taxRate: 0.22,
      TOTAL_ALL_WITH_TAXES,
    }, isConfirmation);

    const filename = `${formatDateForFilename(new Date())}-${document.id}-${document.company.slice(0, 2)}-${isConfirmation ? 'Confirmation' : 'Preventivo'}.pdf`;

    const filePath = path.join(process.env.PDF_STORAGE_FOLDER_DIR, filename);

    fs.writeFile(filePath, pdfBuffer, async (err) => {
      if (err) {
        Logger.error(`Failed to write PDF to ${filePath}: ${err.message}`);
        console.error(`Failed to write PDF to ${filePath}: ${err.message}`);
        return res.status(500).json({
          message: "Failed to save PDF",
          error: err.message,
        });
      }

      // Update the document with the PDF URL after the PDF has been saved
      const pdfUrl =
        process.env.NODE_ENV === "production"
          ? `${process.env.BASE_URL}${
              process.env.CUSTOM_HTTP_PORT
                ? ":" + process.env.CUSTOM_HTTP_PORT
                : ""
            }/pdfs/${filename}`
          : `${process.env.BASE_URL}:${process.env.PORT}/pdfs/${filename}`;

      const pdfEntry = {
        name: filename,
        url: pdfUrl,
        timestamp: new Date().toISOString(),
        revision: document.revisions.length, // assuming the current revision number
      };

      let updatedPdfUrls;

      if (!document.pdfUrls) {
        updatedPdfUrls = [];
      } else if (typeof document.pdfUrls === "string") {
        updatedPdfUrls = safelyParseJSON(document.pdfUrls);
      } else {
        updatedPdfUrls = document.pdfUrls;
      }

      updatedPdfUrls.push(pdfEntry);

      const pdfUrlsPayload = process.env.NODE_ENV === 'development' ? updatedPdfUrls : JSON.stringify(updatedPdfUrls);

      await document.update({ pdfUrls: pdfUrlsPayload });

      const updatedDocument = await Document.findOne({ where: { hash } });

      res.status(201).json({
        message: "Quote created and PDF generated and stored successfully!",
        document: updatedDocument,
      });
    });
  } catch (error) {
    Logger.error(`Error creating quote: ${error.message}`);
    console.error(`Error creating quote: ${error.message}`);
    res.status(400).json({ message: "Error processing request", error });
  }
});

export default router;
