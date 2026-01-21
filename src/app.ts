import express from "express";
import cors from "cors";
import { blogsRouter } from "./blogs/routers/blogs-router";
import { postsRouter } from "./posts/router/posts-router";
import { appSettings } from "./app-settings";

export const app = express();

app.use(express.json());
app.use(cors());

app.use(appSettings.PATHS.BLOGS, blogsRouter);
app.use(appSettings.PATHS.POSTS, postsRouter);
