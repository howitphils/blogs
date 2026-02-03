import { NextFunction, Request, Response } from "express";
import { appConfig } from "../../../app-config";
import { UnauthorizedError } from "../error-handling/custom-errors/unauthorized-error";

export const basicAuthGuard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    throw new UnauthorizedError("Authorization required");
  }

  const base64Credentials = authHeader.split(" ")[1] as string;

  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii",
  );

  const [username, password] = credentials.split(":");

  const validUserName = appConfig.ADMIN_CREDENTIALS.USERNAME;
  const validPassword = appConfig.ADMIN_CREDENTIALS.PASSWORD;

  if (username !== validUserName || password !== validPassword) {
    throw new UnauthorizedError("Invalid credentials");
  }

  next();
};
