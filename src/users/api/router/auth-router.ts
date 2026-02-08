import { Router } from "express";
import { authController } from "../controller/auth-controller";
import { validateLoginBody } from "../validations/login-body-validations";
import { validationChainResult } from "../../../core/middlewares/validation/validation-chain-result";
import { jwtAuthGuard } from "../../../core/middlewares/authentication/jwt-auth";
import { checkUserInReq } from "../../../core/middlewares/utility/check-req-user";
import { validateUserBody } from "../validations/users-body-validation";

export const authRouter = Router();

authRouter.post(
  "/login",
  validateLoginBody,
  validationChainResult,
  authController.loginUser,
);

authRouter.get("/me", jwtAuthGuard, checkUserInReq, authController.getMyInfo);

authRouter.post(
  "/registration",
  validateUserBody,
  validationChainResult,
  authController.registerUser,
);
