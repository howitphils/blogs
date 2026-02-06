import { Router } from "express";
import { validateParamsId } from "../../../core/middlewares/validation/params-id-validation";
import { validationChainResult } from "../../../core/middlewares/validation/validation-chain-result";
import { commentsController } from "../controller/comments-controller";
import { validateCommentBody } from "../validations/comment-body-validations";
import { jwtAuthGuard } from "../../../core/middlewares/authentication/jwt-auth";
import { checkUserInReq } from "../../../core/middlewares/utility/check-req-user";

export const commentsRouter = Router();

commentsRouter.get(
  "/:id",
  validateParamsId,
  validationChainResult,
  commentsController.getCommentById,
);
commentsRouter.put(
  "/:id",
  jwtAuthGuard,
  checkUserInReq,
  validateParamsId,
  validateCommentBody,
  validationChainResult,
  commentsController.updateComment,
);
commentsRouter.delete(
  "/:id",
  jwtAuthGuard,
  checkUserInReq,
  validateParamsId,
  validationChainResult,
  commentsController.deleteComment,
);
