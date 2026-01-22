import { app } from "./app";
import { appConfig } from "./app-config";
import { runDb } from "./db/mongodb";

async function bootstrap() {
  await runDb(appConfig.MONGODB_URI, appConfig.DB_NAME);

  app.listen(appConfig.PORT, () => {
    console.log(`Server is running on port ${appConfig.PORT}`);
  });
}

bootstrap();
