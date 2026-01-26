import { Router } from "express";
import { blogsController } from "../controller/blogs-controller";
import { validateBlogBody } from "../validations/blog-body-validation";
import { basicAuthGuard } from "../../../core/middlewares/authentication/basic-auth-guard";
import { validateParamsId } from "../../../core/middlewares/validation/params-id-validation";
import { validationChainResult } from "../../../core/middlewares/validation/validation-chain-result";
import { validateQueryParams } from "../../../core/middlewares/validation/base-query-validations";

export const blogsRouter = Router();

blogsRouter.get(
  "/",
  validateQueryParams,
  validationChainResult,
  blogsController.getAllBlogs,
);
blogsRouter.get(
  "/:id",
  validateParamsId,
  validationChainResult,
  blogsController.getBlogById,
);
blogsRouter.post(
  "/",
  basicAuthGuard,
  validateBlogBody,
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
