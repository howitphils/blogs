import { Router } from "express";
import { basicAuthGuard } from "../../../core/middlewares/authentication/basic-auth-guard";
import { usersController } from "../controller/users-controller";

export const usersRouter = Router();

usersRouter.get(
  "/",
  basicAuthGuard,
  validateBlogQueryParams,
  validationChainResult,
  usersController.getUsers,
);

usersRouter.post(
  "/",
  basicAuthGuard,
  validateBlogBody,
  validationChainResult,
  usersController.createUser,
);

usersRouter.delete(
  "/:id",
  basicAuthGuard,
  validateParamsId,
  validationChainResult,
  usersController.deleteUser,
);
