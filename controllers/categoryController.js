import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

// Create Category
export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        console.log(req.body);
        if (!name) {
            return res.status(400).send({ message: "Name is required" });
        }
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: false,
                message: "Category already exists",
            });
        }
        const category = await new categoryModel({
            name,
            slug: slugify(name),
        }).save();
        res.status(201).send({
            success: true,
            message: "New category created",
            category,
        });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in category creation",
        });
    }
};

// Update Category
export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        // Update category in the database
        const category = await categoryModel.findByIdAndUpdate(
            id,
            { name, slug: slugify(name) },
            { new: true } // Return the updated document
        );

        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Category not found"
            });
        }

        // Success response
        res.status(200).send({
            success: true,
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).send({
            success: false,
            message: "Error while updating category",
            error: error.message // Send only the error message for security reasons
        });
    }
};

// Get All Categories
export const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "All categories listed",
            categories,
        });
    } catch (error) {
        console.error("Error getting all categories:", error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting all categories",
        });
    }
};

// Get Single Category
export const getSingleCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "Category not found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Category retrieved successfully",
            category,
        });
    } catch (error) {
        console.error("Error getting single category:", error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting single category",
        });
    }
};

// Delete Category
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while deleting category",
        });
    }
};
