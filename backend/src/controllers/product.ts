import type { Request } from "express";
import { tryCatch } from "../middlewares/error.js";
import type {
  BaseQuery,
  NewProductReqestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

export const newProduct = tryCatch(
  async (req: Request<{}, {}, NewProductReqestBody>, res, next) => {
    console.log("test1");
    const { name, price, stock, category } = req.body;

    const photo = req.file;

    if (!photo) return next(new ErrorHandler("please add photo", 400));

    if (!name || !price || !stock || !category) {
      rm(photo.path, () => {
        console.log("Deleted");
      });

      return next(new ErrorHandler("please add all fields", 400));
    }

    await Product.create({
      name,
      price: Number(price),
      stock: Number(stock),
      category: category.toLowerCase(),
      photo: photo?.path,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  },
);

export const getlatestProducts = tryCatch(async (req, res, next) => {
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
  return res.status(200).json({
    success: true,
    products,
  });
});

export const getAllcategoriesProducts = tryCatch(async (req, res, next) => {
  const categories = await Product.distinct("category");
  return res.status(200).json({
    success: true,
    categories,
  });
});

export const getAdminProducts = tryCatch(async (req, res, next) => {
  const products = await Product.find({});
  return res.status(200).json({
    success: true,
    products,
  });
});

export const getSingleProduct = tryCatch(async (req, res, next) => {
  const products = await Product.find({});

  if (!products) return next(new ErrorHandler("Invalid Product Id", 404));

  return res.status(200).json({
    success: true,
    products,
  });
});

export const singleUploadProduct = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;

  const photo = req.file;
  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Invalid Product Id", 404));

  if (photo) {
    rm(product.photo, () => {
      console.log("old photo Deleted");
    });

    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save();

  return res.status(200).json({
    success: true,
    message: "Product Updated successfully",
  });
});

export const deleteProduct = tryCatch(async (req, res, next) => {
  const products = await Product.findById(req.params.id);

  if (!products) return next(new ErrorHandler("Invalid Product Id", 404));

  rm(products.photo, () => {
    console.log("product photo deleted");
  });

  await Product.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Product deleted Successfully",
  });
});

export const getAllProducts = tryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);

    const basequery: BaseQuery = {};

    if (search)
      basequery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      basequery.price = {
        $lte: Number(price),
      };

    if (category) {
      basequery.category = category;
    }
    const products = await Product.find(basequery);

    return res.status(200).json({
      success: true,
      products,
    });
  },
);
