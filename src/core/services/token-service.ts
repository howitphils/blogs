import { decode, sign, verify } from "jsonwebtoken";
import { appConfig } from "../../app-config";
import { UnauthorizedError } from "../middlewares/error-handling/custom-errors/unauthorized-error";
import { randomUUID } from "node:crypto";
import { JwtPayloadAccess, JwtPayloadRefresh } from "../types/jwt-payload-type";
import { injectable } from "inversify";

@injectable()
export class TokenService {
  genereateToken(payload: any, secretKey: string, exp: number): string {
    return sign(payload, secretKey, {
      expiresIn: exp,
    });
  }

  verifyToken(token: string, secretKey: string) {
    try {
      const payload = verify(token, secretKey);
      return payload;
    } catch (error: any) {
      throw new UnauthorizedError("Token is not verified");
    }
  }

  createAccessToken(userId: string): string {
    return this.genereateToken(
      { userId },
      appConfig.ACCESS_JWT_SECRET,
      appConfig.ACCESS_JWT_EXP,
    );
  }

  createRefreshToken(userId: string, deviceId: string): string {
    return this.genereateToken(
      { userId, deviceId },
      appConfig.REFRESH_JWT_SECRET,
      appConfig.REFRESH_JWT_EXP,
    );
  }

  verifyAccessToken(token: string) {
    return this.verifyToken(
      token,
      appConfig.ACCESS_JWT_SECRET,
    ) as JwtPayloadAccess;
  }

  verifyRefreshToken(token: string) {
    return this.verifyToken(
      token,
      appConfig.REFRESH_JWT_SECRET,
    ) as JwtPayloadRefresh;
  }

  decodeRefreshToken(token: string) {
    return decode(token) as JwtPayloadRefresh;
  }

  createRandomCode() {
    return randomUUID();
  }
}
