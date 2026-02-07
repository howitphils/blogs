import { Router } from "express";
import { postsController } from "../controller/posts-controller";
import { validateParamsId } from "../../../core/middlewares/validation/params-id-validation";
import { basicAuthGuard } from "../../../core/middlewares/authentication/basic-auth";
import { validationChainResult } from "../../../core/middlewares/validation/validation-chain-result";
import { validatePostBody } from "../validations/posts-body-validations";
import { validateQueryParams } from "../../../core/middlewares/validation/base-query-validations";
import { jwtAuthGuard } from "../../../core/middlewares/authentication/jwt-auth";
import { checkUserInReq } from "../../../core/middlewares/utility/check-req-user";
import { validateCommentBody } from "../../../comments/api/validations/comment-body-validations";
import { commentsController } from "../../../comments/api/controller/comments-controller";

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

postsRouter.get(
  "/:id/comments",
  validateParamsId,
  validateQueryParams,
  validationChainResult,
  commentsController.getAllComments,
);
postsRouter.post(
  "/:id/comments",
  jwtAuthGuard,
  checkUserInReq,
  validateParamsId,
  validateCommentBody,
  validationChainResult,
  commentsController.createComment,
);
