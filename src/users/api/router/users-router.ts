import { Router } from "express";
import { usersController } from "../controller/users-controller";
import { validateUserQueryParams } from "../validations/users-query-validation";
import { validationChainResult } from "../../../core/middlewares/validation/validation-chain-result";
import { validateUserBody } from "../validations/users-body-validation";
import { validateParamsId } from "../../../core/middlewares/validation/params-id-validation";

export const usersRouter = Router();

usersRouter.get(
  "/",
  validateUserQueryParams,
  validationChainResult,
  usersController.getUsers,
);

usersRouter.post(
  "/",
  validateUserBody,
  validationChainResult,
  usersController.createUser,
);

usersRouter.delete(
  "/:id",
  validateParamsId,
  validationChainResult,
  usersController.deleteUser,
);
