import { configDotenv } from "dotenv";

configDotenv({
  path: ["./.env.dev", "./.env.production"],
  quiet: true,
});

export const appConfig = {
  PORT: process.env.PORT,
  ADMIN_CREDENTIALS: {
    USERNAME: process.env.BASIC_AUTH_USERNAME,
    PASSWORD: process.env.BASIC_AUTH_PASSWORD,
  },
  MONGODB_URI: process.env.MONGODB_URI as string,
  DB_NAME: process.env.DB_NAME as string,
  DB_NAME_TEST: process.env.DB_NAME_TEST as string,
  ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET as string,
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET as string,
  ACCESS_JWT_EXP: Number(process.env.ACCESS_JWT_EXP),
  REFRESH_JWT_EXP: Number(process.env.REFRESH_JWT_EXP),
  NODEMAILER_HOST: process.env.NODEMAILER_HOST,
  NODEMAILER_SENDER_USERNAME: process.env.NODEMAILER_SENDER_USERNAME,
  NODEMAILER_SENDER_PASS: process.env.NODEMAILER_SENDER_PASS,
  REFRESH_COOKIE_NAME: process.env.REFRESH_COOKIE_NAME as string,
  REDIS_URL: process.env.REDIS_URL as string,
  REQUEST_LIMIT: Number(process.env.REQUEST_LIMIT),
};
