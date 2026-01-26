import { configDotenv } from "dotenv";
import { SortByOptions, SortDirections } from "./core/types/query-params-types";

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
  MONGODB_URI: process.env.MONGODB_URI as string,
  DB_NAME: process.env.DB_NAME as string,
  DB_NAME_TEST: "test-db-blogs",
  PAGINATION: {
    DEFAULT_PAGE_NUMBER: 1,
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_SORT_BY: SortByOptions.CREATED_AT,
    DEFAULT_SORT_DIRECTION: SortDirections.DESC,
  },
};
