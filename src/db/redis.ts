import { createClient } from "redis";
import { appConfig } from "../app-config";
import { ServerError } from "../core/middlewares/error-handling/custom-errors/server-error";

export const redisClient = createClient({ url: appConfig.REDIS_URL });

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("redis connected");
  } catch (error) {
    console.log("redis error", error);
    throw new ServerError("Redis did not connect");
  }
};
