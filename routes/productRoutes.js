import express from "express";
import {
    createProductController,
    deleteProductController,
    getProductController,
    getSingleProductController,
    productPhotoController,
    updateProductController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create product
router.post(
    "/create-product",
    requireSignIn,
    isAdmin,
    express.json(),
    createProductController
);

// Update product
router.put(
    "/update-product/:pid",
    requireSignIn,
    isAdmin,
    express.json(),
    updateProductController
);

// Get all products
router.get("/get-product", getProductController);

// Get single product
router.get("/get-product/:slug", getSingleProductController);

// Get product photo
router.get("/product-photo/:pid", productPhotoController);

// Delete product
router.delete(
    "/product/:pid",
    requireSignIn,
    isAdmin,
    deleteProductController
);

export default router;