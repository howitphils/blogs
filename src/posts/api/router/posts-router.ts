import { Router } from "express";
import { postsController } from "../controller/posts-controller";
import { validateParamsId } from "../../../core/middlewares/validation/params-id-validation";
import { basicAuthGuard } from "../../../core/middlewares/authentication/basic-auth-guard";
import { validationChainResult } from "../../../core/middlewares/validation/validation-chain-result";
import { validatePostBody } from "../../validations/posts-body-validations";
import { validateQueryParams } from "../../../core/middlewares/validation/base-query-validations";

export const postsRouter = Router();

postsRouter.get(
  "/",
  validateQueryParams,
  validationChainResult,
  postsController.getAllPosts,
);
postsRouter.get(
  "/:id",
  validateParamsId,
  validationChainResult,
  postsController.getPostById,
);
postsRouter.post(
  "/",
  basicAuthGuard,
  validatePostBody,
  validationChainResult,
  postsController.createPost,
);
postsRouter.put(
  "/:id",
  basicAuthGuard,
  validateParamsId,
  validatePostBody,
  validationChainResult,
  postsController.updatePost,
);
postsRouter.delete(
  "/:id",
  basicAuthGuard,
  validateParamsId,
  validationChainResult,
  postsController.deletePost,
);
