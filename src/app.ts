import express from "express";
import cors from "cors";
import { testingRouter } from "./testing/router/testing-router";
import { blogsRouter } from "./blogs/api/router/blogs-router";
import { postsRouter } from "./posts/api/router/posts-router";
import { errorHandler } from "./core/middlewares/error-handling/error-handler";
import { usersRouter } from "./users/api/router/users-router";
import { authRouter } from "./users/api/router/auth-router";
import { basicAuthGuard } from "./core/middlewares/authentication/basic-auth";
import { commentsRouter } from "./comments/api/router/comments-router";
import cookieParser from "cookie-parser";
import { sessionRouter } from "./users/api/router/session-router";
import { appSettings } from "./app-settings";
import { cookieAuthGuard } from "./core/middlewares/authentication/cookie-auth";

export const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for reaching the API from different origins
app.use(cookieParser());

app.use(appSettings.mainPaths.BLOGS, blogsRouter);
app.use(appSettings.mainPaths.POSTS, postsRouter);
app.use(appSettings.mainPaths.USERS, basicAuthGuard, usersRouter);
app.use(appSettings.mainPaths.AUTH, authRouter);
app.use(appSettings.mainPaths.COMMENTS, commentsRouter);
app.use(appSettings.mainPaths.DEVICES, cookieAuthGuard, sessionRouter);
app.use(appSettings.mainPaths.TESTING, testingRouter);

app.use(errorHandler);
