import { Response, NextFunction, Request } from "express";
import { TokenService } from "../../services/token-service";
import { UnauthorizedError } from "../error-handling/custom-errors/unauthorized-error";
import { appConfig } from "../../../app-config";
import { SessionsRepository } from "../../../users/repository/sessions-repository";
import { container } from "../../../composition-root";

export const cookieAuthGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const sessionsRepository = container.get(SessionsRepository);
  const tokenService = container.get(TokenService);

  const refreshToken = req.cookies[appConfig.REFRESH_COOKIE_NAME];

  if (!refreshToken) {
    throw new UnauthorizedError("Token is not found");
  }

  const payload = tokenService.verifyRefreshToken(refreshToken);

  const session = await sessionsRepository.getSessionByDeviceIdOrFail(
    payload.deviceId,
  );

  if (session.iat !== payload.iat) {
    throw new UnauthorizedError("Token is not valid");
  }

  req.user = {
    userId: payload.userId,
    deviceId: payload.deviceId,
  };

  next();
};
