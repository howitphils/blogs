import { Router } from "express";
import { blogsController } from "../controller/blogs-controller";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getAllBlogs);
blogsRouter.get("/:id", blogsController.getBlogById);
blogsRouter.post("/", blogsController.createBlog);
blogsRouter.put("/:id", blogsController.updateBlog);
blogsRouter.delete("/:id", blogsController.deleteBlog);
