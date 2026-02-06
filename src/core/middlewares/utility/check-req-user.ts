import { NextFunction, Request, Response } from "express";
import { ServerError } from "../error-handling/custom-errors/server-error";

export const checkUserInReq = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    throw new ServerError("User is not found in request");
  }

  next();
};
