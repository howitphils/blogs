import { Router } from "express";
import { authController } from "../controller/auth-controller";
import { validateLoginBody } from "../validations/login-body-validations";
import { validationChainResult } from "../../../core/middlewares/validation/validation-chain-result";

export const authRouter = Router();

authRouter.post(
  "/login",
  validateLoginBody,
  validationChainResult,
  authController.loginUser,
);
