import { Router } from "express";
import { blogsController } from "../controller/blogs-controller";
import { validateBlogBody } from "../validations/blog-body-validation";
import { basicAuthGuard } from "../../../core/middlewares/authentication/basic-auth-guard";
import { validateParamsId } from "../../../core/middlewares/validation/params-id-validation";
import { validationChainResult } from "../../../core/middlewares/validation/validation-chain-result";
import { validateBlogQueryParams } from "../validations/blog-query-validation";
import { validatePostForBlogBody } from "../validations/blog-post-body-validations";

export const blogsRouter = Router();

blogsRouter.get(
  "/",
  validateBlogQueryParams,
  validationChainResult,
  blogsController.getAllBlogs,
);
blogsRouter.get(
  "/:id",
  validateParamsId,
  validationChainResult,
  blogsController.getBlogById,
);

blogsRouter.get(
  "/:id/posts",
  validateParamsId,
  validationChainResult,
  blogsController.getPostsForBlog,
);

blogsRouter.post(
  "/",
  basicAuthGuard,
  validateBlogBody,
  validationChainResult,
  blogsController.createBlog,
);

blogsRouter.post(
  "/:id/posts",
  basicAuthGuard,
  validatePostForBlogBody,
  validationChainResult,
  blogsController.createBlog,
);

blogsRouter.put(
  "/:id",
  basicAuthGuard,
  validateParamsId,
  validateBlogBody,
  validationChainResult,
  blogsController.updateBlog,
);
blogsRouter.delete(
  "/:id",
  basicAuthGuard,
  validateParamsId,
  validationChainResult,
  blogsController.deleteBlog,
);
