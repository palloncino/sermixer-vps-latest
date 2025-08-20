import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import Jimp from "jimp";
import Logger from "../utils/Logger.js";
import authMiddleware from '../utils/authMiddleware.js';

const envPath = process.env.NODE_ENV === "production" ? ".env.remote" : ".env.local";
dotenv.config({ path: envPath });

const router = express.Router();

const storage = multer.memoryStorage(); // Use memory storage to process file in memory
const upload = multer({ storage: storage });

router.get("/get-business-signature", authMiddleware, async (req, res) => {
  try {
    const files = ["BUSINESS_SIGNATURE.png"];
    const filePath = files.find(file => fs.existsSync(path.resolve(process.env.IMAGES_FOLDER_PATH, file)));
    if (filePath) {
      const baseUrl = process.env.BASE_URL;
      const customPort = process.env.NODE_ENV !== "development" && process.env.CUSTOM_HTTP_PORT ? `:${process.env.CUSTOM_HTTP_PORT}` : "";
      res.status(200).json({ signatureUrl: `${baseUrl}${customPort}/images/${filePath}` });
    } else {
      res.status(404).json({ message: "Signature not found" });
    }
  } catch (error) {
    Logger.error(`Error retrieving business signature: ${error.message}, Stack: ${error.stack}`);
    res.status(500).json({ message: "Error retrieving business signature: " + error.message });
  }
});

router.post("/business-signature", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (req.file && req.file.size > process.env.MAX_IMAGE_SIZE) {
      return res.status(413).json({ message: "Image too large" });
    }

    const outputPath = path.resolve(process.env.IMAGES_FOLDER_PATH, "BUSINESS_SIGNATURE.png");

    const image = await Jimp.read(req.file.buffer);
    await image.writeAsync(outputPath);

    res.status(200).json({ message: "Signature uploaded successfully" });
  } catch (error) {
    Logger.error(`Error uploading business signature: ${error.message}`, { requestBody: req.body });
    res.status(400).json({ message: "Error uploading business signature: " + error.message });
  }
});

export default router;
