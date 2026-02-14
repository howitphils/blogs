import { Response, NextFunction, Request } from "express";
import { tokenService } from "../../services/token-service";
import { UnauthorizedError } from "../error-handling/custom-errors/unauthorized-error";
import { appConfig } from "../../../app-config";

export const cookieAuthGuard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.cookies);

  const refreshToken = req.cookies[appConfig.REFRESH_COOKIE_NAME];

  if (!refreshToken) {
    throw new UnauthorizedError("Cookie is not found");
  }

  const payload = tokenService.verifyRefreshToken(refreshToken as string);

  // CASTING PAYLOAD TYPE TO USER REQUEST GLOBAL TYPE (NO ERROR FOR NOW)
  req.user = payload;

  next();
};
