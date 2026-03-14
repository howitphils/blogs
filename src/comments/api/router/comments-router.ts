import { Router } from "express";
import { validateParamsId } from "../../../core/middlewares/validation/params-id-validations";
import { validationChainResult } from "../../../core/middlewares/validation/validation-chain-result";
import { validateCommentBody } from "../validations/comment-body-validations";
import { jwtAuthGuard } from "../../../core/middlewares/authentication/jwt-auth";
import { checkUserInReq } from "../../../core/middlewares/utility/check-req-user";
import { container } from "../../../composition-root";
import { CommentsController } from "../controller/comments-controller";
import { validateLikeStatus } from "../../../core/middlewares/validation/update-like-body-validations";

const commentsController = container.get(CommentsController);

export const commentsRouter = Router();

commentsRouter.get(
  "/:id",
  validateParamsId,
  validationChainResult,
  commentsController.getCommentById.bind(commentsController),
);

commentsRouter.put(
  "/:id",
  jwtAuthGuard,
  checkUserInReq,
  validateParamsId,
  validateCommentBody,
  validationChainResult,
  commentsController.updateComment.bind(commentsController),
);

commentsRouter.put(
  "/:id/like-status",
  jwtAuthGuard,
  checkUserInReq,
  validateParamsId,
  validateLikeStatus,
  validationChainResult,
  commentsController.updateLikeStatus.bind(commentsController),
);

commentsRouter.delete(
  "/:id",
  jwtAuthGuard,
  checkUserInReq,
  validateParamsId,
  validationChainResult,
  commentsController.deleteComment.bind(commentsController),
);
