import { JwtPayload, sign, verify } from "jsonwebtoken";
import { appConfig } from "../../app-config";
import { UnauthorizedError } from "../middlewares/error-handling/custom-errors/unauthorized-error";
import { JwtPayloadWithUser } from "../types/jwt-payload-type";

export const tokenService = {
  genereateToken(payload: any): string {
    return sign(payload, appConfig.JWT_SECRET, {
      expiresIn: appConfig.ACCESS_JWT_EXP,
    });
  },

  createAccessToken(userId: string): string {
    return tokenService.genereateToken({ userId });
  },

  verifyToken(token: string) {
    try {
      const payload = verify(token, appConfig.JWT_SECRET) as JwtPayloadWithUser;
      return payload;
    } catch (error: any) {
      throw new UnauthorizedError(error.message);
    }
  },
};
