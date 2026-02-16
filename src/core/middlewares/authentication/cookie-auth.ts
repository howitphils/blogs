import { Response, NextFunction, Request } from "express";
import { tokenService } from "../../services/token-service";
import { UnauthorizedError } from "../error-handling/custom-errors/unauthorized-error";
import { appConfig } from "../../../app-config";
import { usersRepository } from "../../../users/repository/users-repository";

export const cookieAuthGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies[appConfig.REFRESH_COOKIE_NAME];

  if (!refreshToken) {
    throw new UnauthorizedError("Token is not found");
  }

  const payload = tokenService.verifyRefreshToken(refreshToken);

  const user = await usersRepository.getUserByIdOrFail(payload.userId);

  if (user.tokenInfo.issuedAt !== payload.iat) {
    throw new UnauthorizedError("Token is not valid");
  }

  req.user = payload;

  next();
};
