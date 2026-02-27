import rateLimit from "express-rate-limit";
import { HttpStatus } from "../../types/http-statuses";
import { appSettings } from "../../../app-settings";
import RedisStore from "rate-limit-redis";
import { redisClient } from "../../../db/redis";

// const whitelist = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];

export const rateLimiter = rateLimit({
  windowMs: appSettings.rateLimit.windowMs,
  limit: appSettings.rateLimit.requestLimit,
  message: appSettings.rateLimit.errorMessage,
  statusCode: HttpStatus.TOO_MANY_REQUESTS,
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "rl:",
  }),
  // skip: (req) => {
  //   return whitelist.includes(req.ip as string);
  // },
});

//TODO: зачистка ключей в редис перед каждым тестом (добавить отдельную редис бд - пока невозможно без env.test файла)
// + убрать скип
