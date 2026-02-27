import { app } from "./app";
import { appConfig } from "./app-config";
import { createRateLimiter } from "./core/middlewares/rate-limiting/rate-limiter";
import { runDb } from "./db/mongodb";
import { connectRedis } from "./db/redis";

async function bootstrap() {
  await runDb(appConfig.MONGODB_URI, appConfig.DB_NAME);
  await connectRedis();

  createRateLimiter();

  app.listen(appConfig.PORT, () => {
    console.log(`Server is running on port ${appConfig.PORT}`);
  });
}

bootstrap();
