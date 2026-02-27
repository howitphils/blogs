import rateLimit from "express-rate-limit";
import { HttpStatus } from "../../types/http-statuses";
import { appSettings } from "../../../app-settings";
import RedisStore from "rate-limit-redis";
import { redisClient } from "../../../db/redis";
import { Request } from "express";

const whitelist = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];

const rateLimiterOptions = {
  windowMs: appSettings.rateLimit.windowMs,
  limit: appSettings.rateLimit.requestLimit,
  message: appSettings.rateLimit.errorMessage,
  statusCode: HttpStatus.TOO_MANY_REQUESTS,
  skip: (req: Request) => {
    return whitelist.includes(req.ip as string);
  },
};

export let rateLimiter = rateLimit({ ...rateLimiterOptions });

// Invokes after redis is connected in index.ts and adding storage to redis
export const createRateLimiter = () => {
  rateLimiter = rateLimit({
    ...rateLimiterOptions,
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    }),
  });
};
