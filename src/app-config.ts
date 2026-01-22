import { configDotenv } from "dotenv";

configDotenv({
  path: ["./.env.dev", "./.env.production"],
});

export const appConfig = {
  PORT: process.env.PORT,
  PATHS: {
    BLOGS: "/blogs",
    POSTS: "/posts",
    TESTING: "/testing",
  },
  ADMIN_CREDENTIALS: {
    USERNAME: process.env.BASIC_AUTH_USERNAME,
    PASSWORD: process.env.BASIC_AUTH_PASSWORD,
  },
};
