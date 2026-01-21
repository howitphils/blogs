import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../types/http-status-types";
import { appSettings } from "../../../app-settings";

export const basicAuthGuard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.status(HttpStatus.UNAUTHORIZED).send("Authentication required.");
    return;
  }

  const base64Credentials = authHeader.split(" ")[1] as string;

  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii",
  );

  const [username, password] = credentials.split(":");

  const validUserName = appSettings.ADMIN_CREDENTIALS.USERNAME;
  const validPassword = appSettings.ADMIN_CREDENTIALS.PASSWORD;

  if (username !== validUserName || password !== validPassword) {
    res.status(HttpStatus.UNAUTHORIZED).send("Invalid credentials.");
    return;
  }

  next();
};
