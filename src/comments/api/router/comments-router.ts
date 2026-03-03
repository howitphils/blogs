import { Router } from "express";
import { validateParamsId } from "../../../core/middlewares/validation/params-id-validation";
import { validationChainResult } from "../../../core/middlewares/validation/validation-chain-result";
import { validateCommentBody } from "../validations/comment-body-validations";
import { jwtAuthGuard } from "../../../core/middlewares/authentication/jwt-auth";
import { checkUserInReq } from "../../../core/middlewares/utility/check-req-user";
import { container } from "../../../composition-root";
import { CommentsController } from "../controller/comments-controller";

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

commentsRouter.delete(
  "/:id",
  jwtAuthGuard,
  checkUserInReq,
  validateParamsId,
  validationChainResult,
  commentsController.deleteComment.bind(commentsController),
);
