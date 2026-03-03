import { Response, NextFunction, Request } from "express";
import { UnauthorizedError } from "../error-handling/custom-errors/unauthorized-error";
import { container } from "../../../composition-root";
import { TokenService } from "../../services/token-service";

export const jwtAuthGuard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const tokenService = container.get(TokenService);

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw new UnauthorizedError("Authorization header is required");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new UnauthorizedError("Bearer authorization expected");
  }

  const token = parts[1] as string;

  const payload = tokenService.verifyAccessToken(token);

  // CASTING PAYLOAD TYPE TO USER REQUEST GLOBAL TYPE (NO ERROR FOR NOW)
  req.user = {
    userId: payload.userId,
  };

  next();
};
