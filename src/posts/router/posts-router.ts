import { Router } from "express";
import { postsController } from "../controller/posts-controller";

export const postsRouter = Router();

postsRouter.get("/", postsController.getAllPosts);
postsRouter.get("/:id", postsController.getPostById);
postsRouter.post("/", postsController.createPost);
postsRouter.put("/:id", postsController.updatePost);
postsRouter.delete("/:id", postsController.deletePost);
