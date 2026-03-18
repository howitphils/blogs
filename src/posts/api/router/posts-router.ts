import { Router } from "express";
import { PostsController } from "../controller/posts-controller";
import { validateParamsId } from "../../../core/middlewares/validation/params-id-validations";
import { basicAuthGuard } from "../../../core/middlewares/authentication/basic-auth";
import { validationChainResult } from "../../../core/middlewares/validation/validation-chain-result";
import { validatePostBody } from "../validations/posts-body-validations";
import { validateQueryParams } from "../../../core/middlewares/validation/base-query-validations";
import { jwtAuthGuard } from "../../../core/middlewares/authentication/jwt-auth";
import { checkUserInReq } from "../../../core/middlewares/utility/check-req-user";
import { validateCommentBody } from "../../../comments/api/validations/comment-body-validations";
import { container } from "../../../composition-root";
import { CommentsController } from "../../../comments/api/controller/comments-controller";
import { jwtAuthOptionalGuard } from "../../../core/middlewares/authentication/jwt-optional-auth";

const commentsController = container.get(CommentsController);
const postsController = container.get(PostsController);

export const postsRouter = Router();

// TODO: update like status route
postsRouter.get(
  "/",
  validateQueryParams,
  validationChainResult,
  postsController.getAllPosts.bind(postsController),
);

postsRouter.get(
  "/:id",
  validateParamsId,
  validationChainResult,
  postsController.getPostById.bind(postsController),
);

postsRouter.post(
  "/",
  basicAuthGuard,
  validatePostBody,
  validationChainResult,
  postsController.createPost.bind(postsController),
);

postsRouter.put(
  "/:id",
  basicAuthGuard,
  validateParamsId,
  validatePostBody,
  validationChainResult,
  postsController.updatePost.bind(postsController),
);

postsRouter.delete(
  "/:id",
  basicAuthGuard,
  validateParamsId,
  validationChainResult,
  postsController.deletePost.bind(postsController),
);

postsRouter.get(
  "/:id/comments",
  jwtAuthOptionalGuard,
  validateParamsId,
  validateQueryParams,
  validationChainResult,
  commentsController.getAllComments.bind(commentsController),
);

postsRouter.post(
  "/:id/comments",
  jwtAuthGuard,
  checkUserInReq,
  validateParamsId,
  validateCommentBody,
  validationChainResult,
  commentsController.createComment.bind(commentsController),
);
