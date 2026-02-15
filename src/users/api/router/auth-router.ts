import { Router } from "express";
import { authController } from "../controller/auth-controller";
import { validateLoginBody } from "../validations/login-body-validations";
import { validationChainResult } from "../../../core/middlewares/validation/validation-chain-result";
import { jwtAuthGuard } from "../../../core/middlewares/authentication/jwt-auth";
import { checkUserInReq } from "../../../core/middlewares/utility/check-req-user";
import { validateUserBody } from "../validations/users-body-validation";
import { validateConfirmEmailBody } from "../validations/confirm-email-body-validations";
import { validateResendEmailBody } from "../validations/resend-email-body-validations";
import { cookieAuthGuard } from "../../../core/middlewares/authentication/cookie-auth";

export const authRouter = Router();

authRouter.post(
  "/login",
  validateLoginBody,
  validationChainResult,
  authController.loginUser,
);

authRouter.post(
  "/refresh-token",
  cookieAuthGuard,
  checkUserInReq,
  authController.refreshTokens,
);

authRouter.post(
  "/logout",
  cookieAuthGuard,
  checkUserInReq,
  authController.logout,
);

authRouter.post(
  "/registration-confirmation",
  validateConfirmEmailBody,
  validationChainResult,
  authController.loginUser,
);

authRouter.post(
  "/registration-email-resending",
  validateResendEmailBody,
  validationChainResult,
  authController.resendEmail,
);

authRouter.get("/me", jwtAuthGuard, checkUserInReq, authController.getMyInfo);

authRouter.post(
  "/registration",
  validateUserBody,
  validationChainResult,
  authController.registerUser,
);
