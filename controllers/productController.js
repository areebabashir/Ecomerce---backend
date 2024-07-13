import fs from "fs";
import slugify from "slugify";
import productModel from "../models/productModel.js";

const validateProductFields = (fields, photo) => {
  const { name, description, price, category, quantity } = fields;

  if (!name) {
    throw { status: 500, message: "Name is required" };
  }
  if (!description) {
    throw { status: 500, message: "Description is required" };
  }
  if (!price) {
    throw { status: 500, message: "Price is required" };
  }
  if (!category) {
    throw { status: 500, message: "Category is required" };
  }
  if (!quantity) {
    throw { status: 500, message: "Quantity is required" };
  }
  if (photo && photo.size > 1000000) {
    throw { status: 500, message: "Photo is required and should be less than 1MB" };
  }
};

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    validateProductFields(req.fields, photo);

    const slug = slugify(name);
    const newProduct = new productModel({ ...req.fields, slug });

    if (photo) {
      newProduct.photo.data = fs.readFileSync(photo.path);
      newProduct.photo.contentType = photo.type;
    }

    await newProduct.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    const status = error.status || 500;
    res.status(status).send({
      success: false,
      message: error.message || "Error creating product",
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      totalCount: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).send({
      success: false,
      message: "Error getting products",
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

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.error("Error getting single product:", error);
    res.status(500).send({
      success: false,
      message: "Error getting single product",
      error: error.message,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");

    if (!product || !product.photo || !product.photo.data) {
      return res.status(404).send({
        success: false,
        message: "Product photo not found",
      });
    }

    res.set("Content-Type", product.photo.contentType);
    res.status(200).send(product.photo.data);
  } catch (error) {
    console.error("Error getting product photo:", error);
    res.status(500).send({
      success: false,
      message: "Error getting product photo",
      error: error.message,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.pid).select("-photo");

    if (!deletedProduct) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    validateProductFields(req.fields, photo);

    const slug = slugify(name);
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    if (photo) {
      updatedProduct.photo.data = fs.readFileSync(photo.path);
      updatedProduct.photo.contentType = photo.type;
    }

    await updatedProduct.save();

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};
