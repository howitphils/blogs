import { configDotenv } from "dotenv";

configDotenv({
  path: ["./.env.dev", "./.env.production"],
});

export const appSettings = {
  PORT: process.env.PORT,
  PATHS: {
    BLOGS: "/blogs",
    POSTS: "/posts",
  },
};
