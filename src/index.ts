import { app } from "./app";
import { appConfig } from "./app-config";

app.listen(appConfig.PORT, () => {
  console.log(`Server is running on port ${appConfig.PORT}`);
});
