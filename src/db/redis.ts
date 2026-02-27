import { createClient } from "redis";
import { appConfig } from "../app-config";
import { ServerError } from "../core/middlewares/error-handling/custom-errors/server-error";

export const redisClient = createClient({
  url: appConfig.REDIS_URL,
});

(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.log("redis error", error);

    await redisClient.close();

    throw new ServerError("Redis did not connect");
  }
})();
