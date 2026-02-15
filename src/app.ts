import express from "express";
import cors from "cors";
import { appConfig } from "./app-config";
import { testingRouter } from "./testing/router/testing-router";
import { blogsRouter } from "./blogs/api/router/blogs-router";
import { postsRouter } from "./posts/api/router/posts-router";
import { errorHandler } from "./core/middlewares/error-handling/error-handler";
import { usersRouter } from "./users/api/router/users-router";
import { authRouter } from "./users/api/router/auth-router";
import { basicAuthGuard } from "./core/middlewares/authentication/basic-auth";
import { commentsRouter } from "./comments/api/router/comments-router";
import cookieParser from "cookie-parser";

export const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for reaching the API from different origins
app.use(cookieParser());

app.use(appConfig.PATHS.BLOGS, blogsRouter);
app.use(appConfig.PATHS.POSTS, postsRouter);
app.use(appConfig.PATHS.USERS, basicAuthGuard, usersRouter);
app.use(appConfig.PATHS.AUTH, authRouter);
app.use(appConfig.PATHS.COMMENTS, commentsRouter);
app.use(appConfig.PATHS.TESTING, testingRouter);

app.use(errorHandler);
