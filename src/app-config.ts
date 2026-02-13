import { configDotenv } from "dotenv";
import { SortByOptions, SortDirections } from "./core/types/query-params-types";

configDotenv({
  path: ["./.env.dev", "./.env.production"],
  quiet: true,
});

export const appConfig = {
  PORT: process.env.PORT,
  PATHS: {
    BLOGS: "/blogs",
    POSTS: "/posts",
    USERS: "/users",
    AUTH: "/auth",
    COMMENTS: "/comments",
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
  ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET as string,
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET as string,
  ACCESS_JWT_EXP: Number(process.env.ACCESS_JWT_EXP),
  REFRESH_JWT_EXP: Number(process.env.REFRESH_JWT_EXP),
  NODEMAILER_HOST: process.env.NODEMAILER_HOST,
  NODEMAILER_SENDER_USERNAME: process.env.NODEMAILER_SENDER_USERNAME,
  NODEMAILER_SENDER_PASS: process.env.NODEMAILER_SENDER_PASS,
  REFRESH_COOKIE_NAME: "refresh_cookie",
};
