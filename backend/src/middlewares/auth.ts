import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { tryCatch } from "./error.js";

//middleare for edit(admin only)
export const adminOnly = tryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("id not found", 401));

  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("user not found", 401));

  if (user.role !== "admin")
    return next(new ErrorHandler("only admin can do this", 403));

  next();
});
