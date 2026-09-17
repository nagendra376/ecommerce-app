import express, { Router } from "express";

import { adminOnly } from "../middlewares/auth.js";
import {
  getlatestProducts,
  newProduct,
  getAllcategoriesProducts,
  getAdminProducts,
  getSingleProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";

const app: Router = express.Router();
//create new product
app.post("/new", adminOnly, singleUpload, newProduct);
//to get last 10 products
app.get("/latest", getlatestProducts);
//to get all unique categories
app.get("/categories", getAllcategoriesProducts);
//to get all products
app.get("/admin-product", adminOnly, getAdminProducts);
//to get all products with filters
app.get("/all", getAllProducts);

// To get, update, delete Product
app
  .route("/:id")
  .get(getSingleProduct)
  .put(adminOnly, singleUpload, updateProduct)
  .delete(adminOnly, deleteProduct);

export default app;
