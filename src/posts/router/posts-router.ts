import { Router } from "express";
import { postsController } from "../controller/posts-controller";
import { validateParamsId } from "../../core/middlewares/validation/params-id-validation";
import { validationChainResult } from "../../core/middlewares/validation/validation-chain-result";
import { validatePostBody } from "../validations/posts-body-validations";

export const postsRouter = Router();

postsRouter.get("/", postsController.getAllPosts);
postsRouter.get(
  "/:id",
  validateParamsId,
  validationChainResult,
  postsController.getPostById,
);
postsRouter.post(
  "/",
  validatePostBody,
  validationChainResult,
  postsController.createPost,
);
postsRouter.put(
  "/:id",
  validateParamsId,
  validatePostBody,
  validationChainResult,
  postsController.updatePost,
);
postsRouter.delete(
  "/:id",
  validateParamsId,
  validationChainResult,
  postsController.deletePost,
);
