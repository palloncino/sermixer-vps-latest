import express from "express";
import dotenv from "dotenv";
import authMiddleware from "../utils/authMiddleware.js";
import { sendDocumentCreatedEmail, sendClosedDocumentEmail } from "../utils/emailManager.js";
import { parseJSONIfNeeded } from "../utils/parseDocumentProperties.js";
import Document from "../models/document.js";

const envPath = process.env.NODE_ENV === "production" ? ".env.remote" : ".env.local";
dotenv.config({ path: envPath });

const router = express.Router();

router.post("/created-document", authMiddleware, async (req, res) => {
  const { clientName, hash, otp } = req.body;
  const clientEmail = "powerhydratoni@gmail.com";

  try {
    const emailOutcome = await sendDocumentCreatedEmail(
      clientEmail,
      clientName,
      hash,
      otp
    );
    const { success } = emailOutcome;
    if (!success) {
      return res.status(404).json({ error: emailOutcome.error });
    }

    // Find and update the document status
    const document = await Document.findOne({ where: { hash } });
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    let status = parseJSONIfNeeded(document.status);
    status.OTP_SENT = true;
    document.status = status;
    await document.save();

    res.status(200).json({
      success: true,
      message: "Email with OTP sent successfully and document status updated.",
    });
  } catch (error) {
    console.error("Error sending created document email:", error);
    res.status(500).json({ error: "Error sending created document email." });
  }
});

router.post("/closed-document", authMiddleware, async (req, res) => {
  const { clientName, hash } = req.body;
  const clientEmail = "powerhydratoni@gmail.com";

  try {
    const emailOutcome = await sendClosedDocumentEmail(clientEmail, clientName);
    const { success } = emailOutcome;
    if (!success) {
      return res.status(500).json({ error: emailOutcome.error });
    }

    res.status(200).json({
      success: true,
      message: "Email about document closure sent successfully.",
    });
  } catch (error) {
    console.error("Error sending closed document email:", error);
    res.status(500).json({ error: "Error sending closed document email." });
  }
});

export default router;
