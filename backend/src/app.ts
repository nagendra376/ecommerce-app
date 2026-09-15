import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import express from "express";
import productRoute from "./routes/product.js";
import { config } from "dotenv";

config({
  path: "./.env",
});

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";

connectDB(mongoURI);

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("api working ");
});

//using routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
