import { ErrorRequestHandler, Request, Response } from "express";
import { HttpStatus } from "../../types/http-status-types";
import { MongoError } from "mongodb";
import { HttpError } from "./custom-errors/http-error";

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err instanceof MongoError) {
    console.error(err);

    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Database error" });
  }

  console.error(err);

  return res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: "Unexpected error" });
};
