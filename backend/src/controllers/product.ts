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
import { nodeCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
// import { faker } from "@faker-js/faker";

//re-validate on new,update/delete, new order product
export const getlatestProducts = tryCatch(async (req, res, next) => {
  let products = [];

  if (nodeCache.has("latest-product")) {
    products = JSON.parse(nodeCache.get("latest-product") as string);
  } else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);

    nodeCache.set("latest-product", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getAllcategoriesProducts = tryCatch(async (req, res, next) => {
  let categories;

  if (nodeCache.has("categories")) {
    categories = JSON.parse(nodeCache.get("categories") as string);
  } else {
    categories = await Product.distinct("category");
    nodeCache.set("categories", JSON.stringify(categories));
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});

export const getAdminProducts = tryCatch(async (req, res, next) => {
  let products;
  if (nodeCache.has("all-products")) {
    products = JSON.parse(nodeCache.get("all-products") as string);
  } else {
    products = await Product.find({});
    nodeCache.set("all-products", JSON.stringify(products));
  }
  return res.status(200).json({
    success: true,
    products,
  });
});

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

    await invalidateCache({ product: true, admin: true });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  },
);

export const updateProduct = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photo = req.file;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  if (photo) {
    rm(product.photo!, () => {
      console.log("Old Photo Deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save();

  await invalidateCache({ product: true, productId: String(product._id) , admin:true});

  return res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
  });
});

export const getSingleProduct = tryCatch(async (req, res, next) => {
  let product;
  const id = req.params.id;

  if (nodeCache.has(`product-${id}`)) {
    product = JSON.parse(nodeCache.get(`product-${id}`) as string);
  } else {
    product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("product not found", 404));
    nodeCache.set(`product-${id}`, JSON.stringify(product));
  }

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  return res.status(200).json({
    success: true,
    product,
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

  await invalidateCache({ product: true , admin:true});

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

    const productsPromise = Product.find(basequery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProduct] = await Promise.all([
      productsPromise,
      Product.countDocuments(basequery),
    ]);

    const totalPage = Math.ceil(filteredOnlyProduct / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  },
);

// export const generateRandomProducts = async (count: number = 10) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\macbook.webp",
//       price: Number(faker.commerce.price({ min: 1500, max: 80000, dec: 0 })),
//       stock: Number(faker.commerce.price({ min: 0, max: 100, dec: 0 })),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };

//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({ success: true });
// };
