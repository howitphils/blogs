import rateLimit from "express-rate-limit";
import { HttpStatus } from "../../types/http-status-types";
import { appSettings } from "../../../app-settings";

export const rateLimiter = rateLimit({
  windowMs: appSettings.rateLimit.windowMs,
  limit: appSettings.rateLimit.requestLimit,
  message: appSettings.rateLimit.errorMessage,
  statusCode: HttpStatus.TOO_MANY_REQUESTS,
});
