import productModel from "../models/productModel.js";
import slugify from "slugify";

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.body;
        
        // Validation
        const requiredFields = { name, description, price, category, quantity, shipping };
        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.status(400).json({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` });
            }
        }

        const product = new productModel({
            ...req.body,
            slug: slugify(name)
        });
        
        await product.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Error creating product"
        });
    }
};
//get all productsexport 
export const getProductController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate("category")
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            countTotal: products.length,
            message: "All Products",
            products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error in getting products",
            error: error.message,
        });
    }
};

export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel
            .findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("category");
        res.status(200).json({
            success: true,
            message: "Single Product Fetched",
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error while getting single product",
            error: error.message,
        });
    }
};

export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error while getting photo",
            error: error.message,
        });
    }
};

export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).json({
            success: true,
            message: "Product Deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error while deleting product",
            error: error.message,
        });
    }
};

export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.body;
        
        // Validation
        const requiredFields = { name, description, price, category, quantity };
        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.status(400).json({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} is Required` });
            }
        }

        const updatedFields = { ...req.body, slug: slugify(name) };
        
        const product = await productModel.findByIdAndUpdate(
            req.params.pid,
            updatedFields,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Error in Update product",
        });
    }
};