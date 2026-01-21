import express from "express";
import cors from "cors";
import { blogsRouter } from "./blogs/router/blogs-router";
import { postsRouter } from "./posts/router/posts-router";
import { appSettings } from "./app-settings";
import { testingRouter } from "./testing/router/testing-router";

export const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for reaching the API from different origins

app.use(appSettings.PATHS.BLOGS, blogsRouter);
app.use(appSettings.PATHS.POSTS, postsRouter);
app.use(appSettings.PATHS.TESTING, testingRouter);
