import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../types/http-statuses";
import { MongoError } from "mongodb";
import { HttpError } from "./custom-errors/http-error";
import { NotUniqueUserError } from "../../../users/application/errors/users-errors";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof NotUniqueUserError) {
    return res.status(err.status).json(err.errorResponse);
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err instanceof MongoError) {
    console.log(err);

    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Database error" });
  }

  console.log(err);

  return res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: "Unexpected error" });
};
