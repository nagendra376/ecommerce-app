import express, { Router } from "express";

import { adminOnly } from "../middlewares/auth.js";
import {
  getlatestProducts,
  newProduct,
  getAllcategoriesProducts,
  getAdminProducts,
  getSingleProduct,
  singleUploadProduct,
  deleteProduct,
  getAllProducts,
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
// to get, update and delete product
app
  .route("/:id")
  .get(getSingleProduct)
  .put(adminOnly, singleUpload, singleUploadProduct)
  .delete(adminOnly, deleteProduct);

//to get all products with filters
app.get("/all", getAllProducts);

export default app;
