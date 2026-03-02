import rateLimit from "express-rate-limit";
import { HttpStatus } from "../../types/http-statuses";
import { appSettings } from "../../../app-settings";
import RedisStore from "rate-limit-redis";
import { redisClient } from "../../../db/redis";

export const rateLimiter = rateLimit({
  windowMs: appSettings.rateLimit.windowMs,
  limit: appSettings.rateLimit.requestLimit,
  message: appSettings.rateLimit.errorMessage,
  statusCode: HttpStatus.TOO_MANY_REQUESTS,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
});
