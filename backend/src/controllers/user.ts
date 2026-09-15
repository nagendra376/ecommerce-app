import { json, type NextFunction, type Request, type Response } from "express";
import { User } from "../models/user.js";
import type { NewUserReqestBody } from "../types/types.js";
import { tryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";

export const newUser = tryCatch(async (req, res, next) => {
  const { name, email, photo, gender, _id, dob } = req.body;

  let user = await User.findById(_id);

  if (user) {
    return res.status(200).json({
      success: true,
      message: `welcome, ${user.name}`,
    });
  }

  if (!_id || !name || !email || !photo || !dob) {
    return next(new ErrorHandler("please add all fieds", 400));
  }

  user = await User.create({
    name,
    email,
    photo,
    gender,
    _id,
    dob: new Date(dob),
  });

  return res.status(201).json({
    success: true,
    message: `welcome, ${user.name}`,
  });
});

export const getAllUsers = tryCatch(async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    users,
  });
});

export const getUser = tryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid Id", 400));

  return res.status(200).json({
    success: true,
    user,
  });
});

export const deleteUser = tryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid Id", 400));

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "user deleted successfully",
  });
});
