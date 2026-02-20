import rateLimit from "express-rate-limit";
import { HttpStatus } from "../../types/http-status-types";
import { appSettings } from "../../../app-settings";

const whitelist = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];

export const rateLimiter = rateLimit({
  windowMs: appSettings.rateLimit.windowMs,
  limit: appSettings.rateLimit.requestLimit,
  message: appSettings.rateLimit.errorMessage,
  statusCode: HttpStatus.TOO_MANY_REQUESTS,
  skip: (req) => {
    return whitelist.includes(req.ip as string);
  },
});
