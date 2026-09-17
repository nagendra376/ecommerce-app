import userRoute from "./routes/user.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import express from "express";
import productRoute from "./routes/product.js";
import { config } from "dotenv";
import NodeCache from "node-cache";
import morgan from "morgan";
import { Stripe } from "stripe";


config({
  path: "./.env",
});

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";

connectDB(mongoURI);

export const nodeCache = new NodeCache();

export const stripe = new Stripe(stripeKey);

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"))

app.get("/", (req, res) => {
  res.send("api working ");
});

//using routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
