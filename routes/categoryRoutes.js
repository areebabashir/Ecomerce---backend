import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
    createCategoryController,
    updateCategoryController,
    getAllCategoriesController,
    getSingleCategoryController,
    deleteCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

// Create Category
router.post(
    "/create-category",
    requireSignIn,
    isAdmin,
    createCategoryController
);

// Update Category
router.put(
    "/update-category/:id",
    requireSignIn,
    isAdmin,
    updateCategoryController
);

// Get All Categories
router.get("/get-categories", getAllCategoriesController);

// Get Single Category
router.get("/single-category/:slug", getSingleCategoryController);

// Delete Category
router.delete(
    "/delete-category/:id",
    requireSignIn,
    isAdmin,
    deleteCategoryController
);

export default router;
