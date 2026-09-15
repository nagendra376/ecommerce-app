import { type NextFunction, type Request, type Response } from "express";

export interface NewUserReqestBody {
  name: string;
  email: string;
  photo: string;
  gender: "male" | "female";
  role: "admin" | "user";
  _id: string;
  dob: Date;
}

export interface NewProductReqestBody {
  name: string;
  category: string;
  price: string;
  stock: string;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void | Response<any, Record<string, any>>>;

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };
  category?: string;
}
