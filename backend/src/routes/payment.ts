import express, { Router } from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  applyDiscount,
  newCoupon,
  allCoupons,
  deleteCoupon,
  createPaymentIntent,
} from "../controllers/payment.js";

const app: Router = express.Router();

app.post("/create", createPaymentIntent);

app.get("/discount", applyDiscount);

app.post("/coupon/new", adminOnly, newCoupon);

app.get("/coupon/all", adminOnly, allCoupons);

app.delete("/coupon/:id", adminOnly, deleteCoupon);

export default app;
