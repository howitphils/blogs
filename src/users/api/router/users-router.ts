import { Router } from "express";
import { validateUserQueryParams } from "../validations/users-query-validation";
import { validationChainResult } from "../../../core/middlewares/validation/validation-chain-result";
import { validateUserBody } from "../validations/users-body-validation";
import { validateParamsId } from "../../../core/middlewares/validation/params-id-validation";
import { container } from "../../../composition-root";
import { UsersController } from "../controller/users-controller";

export const usersRouter = Router();
const usersController = container.get(UsersController);

usersRouter.get(
  "/",
  validateUserQueryParams,
  validationChainResult,
  usersController.getUsers.bind(usersController),
);

usersRouter.post(
  "/",
  validateUserBody,
  validationChainResult,
  usersController.createUser.bind(usersController),
);

usersRouter.delete(
  "/:id",
  validateParamsId,
  validationChainResult,
  usersController.deleteUser.bind(usersController),
);
