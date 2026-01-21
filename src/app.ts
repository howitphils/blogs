import express from "express";
import cors from "cors";
import { blogsRouter } from "./blogs/routers/blogs-router";
import { postsRouter } from "./posts/router/posts-router";

export const app = express();

app.use(express.json());
app.use(cors());

app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
