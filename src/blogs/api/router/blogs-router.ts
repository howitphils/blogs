import { validateQueryParams } from "./../../../core/middlewares/validation/base-query-validations";
import { Router } from "express";
import { validateBlogBody } from "../validations/blog-body-validation";
import { basicAuthGuard } from "../../../core/middlewares/authentication/basic-auth";
import { validateParamsId } from "../../../core/middlewares/validation/params-id-validation";
import { validationChainResult } from "../../../core/middlewares/validation/validation-chain-result";
import { validateBlogQueryParams } from "../validations/blog-query-validation";
import { validatePostForBlogBody } from "../validations/blog-post-body-validations";
import { container } from "../../../composition-root";
import { BlogsController } from "../controller/blogs-controller";

const blogsController = container.get(BlogsController);

export const blogsRouter = Router();

blogsRouter.get(
  "/",
  validateBlogQueryParams,
  validationChainResult,
  blogsController.getAllBlogs.bind(blogsController),
);
blogsRouter.get(
  "/:id",
  validateParamsId,
  validationChainResult,
  blogsController.getBlogById.bind(blogsController),
);

blogsRouter.get(
  "/:id/posts",
  validateParamsId,
  validateQueryParams,
  validationChainResult,
  blogsController.getPostsForBlog.bind(blogsController),
);

blogsRouter.post(
  "/",
  basicAuthGuard,
  validateBlogBody,
  validationChainResult,
  blogsController.createBlog.bind(blogsController),
);

blogsRouter.post(
  "/:id/posts",
  basicAuthGuard,
  validateParamsId,
  validatePostForBlogBody,
  validationChainResult,
  blogsController.createPostForBlog.bind(blogsController),
);

blogsRouter.put(
  "/:id",
  basicAuthGuard,
  validateParamsId,
  validateBlogBody,
  validationChainResult,
  blogsController.updateBlog.bind(blogsController),
);
blogsRouter.delete(
  "/:id",
  basicAuthGuard,
  validateParamsId,
  validationChainResult,
  blogsController.deleteBlog.bind(blogsController),
);
