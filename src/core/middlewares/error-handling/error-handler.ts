import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export class CustomError extends Error {}

export const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
