import express from "express";
import cors from "cors";
import { blogsRouter } from "./blogs/router/blogs-router";
import { postsRouter } from "./posts/router/posts-router";
import { appConfig } from "./app-config";
import { testingRouter } from "./testing/router/testing-router";

export const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for reaching the API from different origins

app.use(appConfig.PATHS.BLOGS, blogsRouter);
app.use(appConfig.PATHS.POSTS, postsRouter);
app.use(appConfig.PATHS.TESTING, testingRouter);
