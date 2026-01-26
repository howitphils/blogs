import express from "express";
import cors from "cors";
import { appConfig } from "./app-config";
import { testingRouter } from "./testing/router/testing-router";
import { blogsRouter } from "./blogs/api/router/blogs-router";
import { postsRouter } from "./posts/api/router/posts-router";

export const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for reaching the API from different origins

app.use(appConfig.PATHS.BLOGS, blogsRouter);
app.use(appConfig.PATHS.POSTS, postsRouter);
app.use(appConfig.PATHS.TESTING, testingRouter);
