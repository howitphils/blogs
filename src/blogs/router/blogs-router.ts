import { Router } from "express";
import { blogsController } from "../controller/blogs-controller";
import { validateParamsId } from "../../core/middlewares/params-id-validation";
import { validationChainResult } from "../../core/middlewares/validation-chain-result";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getAllBlogs);
blogsRouter.get(
  "/:id",
  validateParamsId,
  validationChainResult,
  blogsController.getBlogById,
);
blogsRouter.post("/", blogsController.createBlog);
blogsRouter.put("/:id", blogsController.updateBlog);
blogsRouter.delete("/:id", blogsController.deleteBlog);
