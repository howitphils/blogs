import { ErrorRequestHandler, Request, Response } from "express";
import { HttpStatus } from "../../types/http-status-types";
import { MongoError } from "mongodb";
import { ErrorResponse } from "../../types/error-response-types";

export class ErrorResponseWithMessage extends Error {
  public status: HttpStatus;

  constructor(message: string, status: HttpStatus) {
    super(message);
    this.status = status;
    this.name = "ErrorResponseWithMessage";
  }
}

export class ErrorResponseWithObject extends Error {
  public status: HttpStatus;
  public errorOutput: ErrorResponse;

  constructor(status: HttpStatus, errorOutput: ErrorResponse) {
    super("");
    this.status = status;
    this.errorOutput = errorOutput;
    this.name = "ErrorResponseWithObject";
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
): Response => {
  if (err instanceof ErrorResponseWithMessage) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err instanceof ErrorResponseWithObject) {
    return res.status(err.status).json(err.errorOutput);
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
