import { decode, JwtPayload, sign, verify } from "jsonwebtoken";
import { appConfig } from "../../app-config";
import { UnauthorizedError } from "../middlewares/error-handling/custom-errors/unauthorized-error";
import { JwtPayloadWithUser } from "../types/jwt-payload-type";
import { randomUUID } from "node:crypto";

export const tokenService = {
  genereateToken(payload: any, secretKey: string, exp: number): string {
    return sign(payload, secretKey, {
      expiresIn: exp,
    });
  },
  verifyToken(token: string, secretKey: string) {
    try {
      const payload = verify(token, secretKey);
      return payload;
    } catch (error: any) {
      throw new UnauthorizedError("Token is not verified");
    }
  },

  createAccessToken(userId: string, deviceId: string): string {
    return tokenService.genereateToken(
      { userId, deviceId },
      appConfig.ACCESS_JWT_SECRET,
      appConfig.ACCESS_JWT_EXP,
    );
  },

  createRefreshToken(userId: string, deviceId: string): string {
    return tokenService.genereateToken(
      { userId, deviceId },
      appConfig.REFRESH_JWT_SECRET,
      appConfig.REFRESH_JWT_EXP,
    );
  },

  verifyAccessToken(token: string) {
    return tokenService.verifyToken(
      token,
      appConfig.ACCESS_JWT_SECRET,
    ) as JwtPayloadWithUser;
  },

  verifyRefreshToken(token: string) {
    return tokenService.verifyToken(
      token,
      appConfig.REFRESH_JWT_SECRET,
    ) as JwtPayloadWithUser;
  },

  decodeToken(token: string) {
    return decode(token) as JwtPayload;
  },

  createRandomCode() {
    return randomUUID();
  },
};
