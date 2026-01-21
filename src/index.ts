import { app } from "./app";
import { appSettings } from "./app-settings";

app.listen(appSettings.PORT, () => {
  console.log(`Server is running on port ${appSettings.PORT}`);
});
