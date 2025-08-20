import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { sequelize } from "../config/db.js";
import Product from "../models/product.js";
import Logger from "../utils/Logger.js";
import authMiddleware from '../utils/authMiddleware.js';
import { calculateDiscountedPrice } from '../utils/numberUtils.js';
import { v4 as uuidv4 } from 'uuid';

const envPath = process.env.NODE_ENV === "production" ? ".env.remote" : ".env.local";
dotenv.config({ path: envPath });

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.IMAGES_FOLDER_PATH);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept all files for now, we'll handle specific file types in the route
    cb(null, true);
  }
});

// ✅ Get all products
router.get("/get-products", authMiddleware, async (req, res) => {
  try {
    let products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    Logger.error(`Error retrieving products: ${error.message}, Stack: ${error.stack}`);
    res.status(500).json({ message: "Error retrieving products: " + error.message });
  }
});

// ✅ Get a single product by ID
router.get("/get-product/:productId", authMiddleware, async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product: product });
  } catch (error) {
    Logger.error(`Error retrieving product ID ${productId}: ${error.message}`);
    res.status(500).json({ success: false, message: "Error retrieving product: " + error.message });
  }
});

// ✅ Delete products - check that deletes the images for both prod and comp
router.delete("/delete-products", authMiddleware, async (req, res) => {
  const rawIds = req.body.ids;

  const idsToDelete = rawIds.map((id) => parseInt(id, 10));
  if (idsToDelete.some(isNaN)) {
    return res.status(400).send("Invalid request, all 'ids' must be valid integers.");
  }

  const transaction = await sequelize.transaction();
  try {
    const productsToDelete = await Product.findAll({ where: { id: idsToDelete } });

    const result = await Product.destroy({ where: { id: idsToDelete }, transaction });
    
    if (result === 0) {
      await transaction.rollback();
      Logger.warn(`No products found with given IDs: ${idsToDelete.join(", ")}`);
      return res.status(404).send("No products found with the given IDs.");
    }

    // Delete the image files associated with the products and their components
    for (const product of productsToDelete) {
      // Delete product image
      if (product.imgUrl) {
        const filePath = path.join(process.env.IMAGES_FOLDER_PATH, path.basename(product.imgUrl));
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            Logger.info(`Successfully deleted file: ${filePath}`);
          } catch (error) {
            Logger.error(`Error deleting file: ${filePath}`, error.message);
          }
        } else {
          Logger.warn(`File not found: ${filePath}`);
        }
      }

      for (const component of product.components) {
        if (component.imgUrl) {
          const componentFilePath = path.join(process.env.IMAGES_FOLDER_PATH, path.basename(component.imgUrl));
          if (fs.existsSync(componentFilePath)) {
            try {
              fs.unlinkSync(componentFilePath);
              Logger.info(`Successfully deleted component file: ${componentFilePath}`);
            } catch (error) {
              Logger.error(`Error deleting component file: ${componentFilePath}`, error.message);
            }
          } else {
            Logger.warn(`Component file not found: ${componentFilePath}`);
          }
        }
      }
    }

    await transaction.commit();
    res.status(200).send({
      ids: idsToDelete,
      message: `${result} products with IDs: ${idsToDelete.join(", ")} were successfully deleted.`,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: "Error deleting products: " + error.message });
  }
});

// ✅ Create a new product
router.post("/create-product", authMiddleware, upload.any(), async (req, res) => {

  // Extract and parse the productData JSON string
  let productData;
  try {
    productData = JSON.parse(req.body.productData);  // Parse the productData string
    Logger.info('Parsed productData:', productData);
  } catch (error) {
    return res.status(400).json({ message: "Invalid productData JSON" });
  }

  try {
    const existingProduct = await Product.findOne({ where: { name: productData.name } });

    if (existingProduct) {
      return res.status(400).json({ message: "A product with this name already exists" });
    }


    const productPayload = {
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      category: productData.category || '',
      company: productData.company || '',
      components: productData.components || [],
      imgUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };


    // Handle main product image
    const mainImage = req.files?.find(file => file.fieldname === 'image');
    if (mainImage) {
      Logger.info("Main product image received", { filename: mainImage.originalname });
      productPayload.imgUrl = `${process.env.BASE_URL}:${process.env.CUSTOM_HTTP_PORT}/images/${mainImage.filename}`;
    } else {
      Logger.warn("No main product image received");
    }


    // Handle components
    if (Array.isArray(productData.components)) {
      productPayload.components = productData.components.map((component, index) => {
        const parsedComponent = {
          discount: 0, // intended as percentage, integer number
          description: component.description || '',
          included: false,
          image: null, // Will be binary file, form data field: componentImages[i]
          imgUrl: null, // will come in as empty string, returned as URL if image saved
          name: component.name,
          price: parseFloat(component.price) || 0, 
          quantity: 1,
        };
        const componentImage = req.files?.find(file => file.fieldname === `componentImages[${index}]`);
        if (componentImage) {
          Logger.info("Component image received", { componentName: component.name, filename: componentImage.originalname });
          parsedComponent.imgUrl = `${process.env.BASE_URL}:${process.env.CUSTOM_HTTP_PORT}/images/${componentImage.filename}`;
        } else {
          Logger.warn(`No image received for component: ${component.name}`);
        }

        return parsedComponent;
      });
    }

    const newProduct = await Product.create(productPayload);
    res.status(201).json({success: true, product: newProduct});
  } catch (error) {
    res.status(400).json({ message: "Error creating product: " + error.message });
  }
});

// ✅ Edit product
router.put("/edit-product", upload.any(), async (req, res) => {
  
  // Extract and parse the productData JSON string
  let productData;
  try {
    productData = JSON.parse(req.body.productData);  // Parse the productData string
    Logger.info('Parsed productData:', productData);
  } catch (error) {
    return res.status(400).json({ message: "Invalid productData JSON" });
  }

  // Does the product have an id
  const id = parseInt(productData.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID provided" });
  }

  try {
    const existingProduct = await Product.findByPk(id);
    
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updates = {
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      category: productData.category || '',
      company: productData.company || '',
      discount: parseFloat(productData.discount) || 0,
      discountedPrice: calculateDiscountedPrice(parseFloat(productData.price), parseFloat(productData.discount) || 0),
      updatedAt: new Date(),
    };

    // Handle main product image
    const mainImage = req.files?.find(file => file.fieldname === 'image');
    if (mainImage) {
      updates.imgUrl = `${process.env.BASE_URL}:${process.env.CUSTOM_HTTP_PORT}/images/${mainImage.filename}`;
    }

    // Handle components - must be an array
    if (Array.isArray(productData.components)) {

      // Check if components are a string and convert it back to JSON
      if (typeof productData.components === 'string') {
        try {
          productData.components = JSON.parse(productData.components);
        } catch (error) {
          return res.status(400).json({ message: "Invalid components format" });
        }
      }

      updates.components = productData.components.map((component, index) => {
        const parsedComponent = {
          id: component.id || uuidv4(),
          name: component.name,
          price: parseFloat(component.price) || 0,
          description: component.description || '',
          imgUrl: null,
        };

        const componentImage = req.files?.find(file => file.fieldname === `componentImages[${index}]`);
        if (componentImage) {
          parsedComponent.imgUrl = `${process.env.BASE_URL}:${process.env.CUSTOM_HTTP_PORT}/images/${componentImage.filename}`;
        }

        return parsedComponent;
      });
    } else {
      Logger.error("Components is not an array", { components: productData.components });
      return res.status(400).json({ message: "Components must be an array" });
    }

    // Log the updates object before updating the product
    Logger.info("Updates object before saving:", updates);

    // Update product with the new values
    await existingProduct.update(updates);

    // Fetch the updated product
    const updatedProduct = await Product.findByPk(id);

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    Logger.error(`Error updating product: ${error.message}`, { requestBody: req.body });
    res.status(400).json({ success: false, message: "Error updating product: " + error.message });
  }
});

export default router;