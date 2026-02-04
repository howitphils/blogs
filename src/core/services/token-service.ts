import { JwtPayload, sign, verify } from "jsonwebtoken";
import { appConfig } from "../../app-config";
import { UnauthorizedError } from "../middlewares/error-handling/custom-errors/unauthorized-error";

export const tokenService = {
  genereateToken(payload: any): string {
    return sign(payload, appConfig.JWT_SECRET, { expiresIn: "2m" });
  },

  createAccessToken(userId: string): string {
    return tokenService.genereateToken({ userId });
  },

  verifyToken(token: string) {
    try {
      const payload = verify(token, appConfig.JWT_SECRET) as JwtPayload;
      return payload;
    } catch (error: any) {
      throw new UnauthorizedError(error.message);
    }
  },
};
