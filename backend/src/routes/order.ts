import express, { Router } from "express";
import { adminOnly } from "../middlewares/auth.js";

import {
  myOrders,
  newOrder,
  allOrders,
  getSingleOrder,
  processOrder,
  deleteOrder,
} from "../controllers/order.js";

const app: Router = express.Router();

app.post("/new", newOrder);

app.get("/my", myOrders);

app.get("/all", adminOnly, allOrders);

app
  .route("/:id")
  .get(getSingleOrder)
  .put(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);

export default app;
