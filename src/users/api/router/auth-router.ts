import { Router } from "express";
import { authController } from "../controller/auth-controller";
import { validateLoginBody } from "../validations/login-body-validations";
import { validationChainResult } from "../../../core/middlewares/validation/validation-chain-result";
import { jwtAuthGuard } from "../../../core/middlewares/authentication/jwt-auth";
import { checkUserInReq } from "../../../core/middlewares/utility/check-req-user";
import { validateUserBody } from "../validations/users-body-validation";
import { validateConfirmEmailBody } from "../validations/confirm-email-body-validations";
import { validateEmailBody } from "../validations/resend-email-body-validations";
import { cookieAuthGuard } from "../../../core/middlewares/authentication/cookie-auth";
import { rateLimiter } from "../../../core/middlewares/rate-limiting/rate-limiter";
import { validateNewPasswordBody } from "../validations/new-password-body-validations";

export const authRouter = Router();

authRouter.post(
  "/login",
  rateLimiter,
  validateLoginBody,
  validationChainResult,
  authController.loginUser,
);

authRouter.post(
  "/password-recovery",
  rateLimiter,
  validateEmailBody,
  validationChainResult,
  authController.recoverPassword,
);

authRouter.post(
  "/new-password",
  rateLimiter,
  validateNewPasswordBody,
  validationChainResult,
  authController.updatePassword,
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
  rateLimiter,
  validateConfirmEmailBody,
  validationChainResult,
  authController.confirmEmail,
);

authRouter.post(
  "/registration-email-resending",
  rateLimiter,
  validateEmailBody,
  validationChainResult,
  authController.resendEmail,
);

authRouter.get("/me", jwtAuthGuard, checkUserInReq, authController.getMyInfo);

authRouter.post(
  "/registration",
  rateLimiter,
  validateUserBody,
  validationChainResult,
  authController.registerUser,
);
