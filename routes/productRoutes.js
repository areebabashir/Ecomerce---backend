import express from "express";
import formidable from "express-formidable";

import {
    createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
  brainTreePaymentController,
  braintreeTokenController
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create product
router.post(
    "/create-product",
    formidable(),
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
router.delete("/delete-product/:pid", deleteProductController
);
//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);
//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);
export default router;
