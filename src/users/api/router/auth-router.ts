import { Router } from "express";
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
import { container } from "../../../composition-root";
import { AuthController } from "../controller/auth-controller";

export const authRouter = Router();

const authController = container.get(AuthController);

authRouter.post(
  "/login",
  rateLimiter,
  validateLoginBody,
  validationChainResult,
  authController.loginUser.bind(authController),
);

authRouter.post(
  "/password-recovery",
  rateLimiter,
  validateEmailBody,
  validationChainResult,
  authController.recoverPassword.bind(authController),
);

authRouter.post(
  "/new-password",
  rateLimiter,
  validateNewPasswordBody,
  validationChainResult,
  authController.updatePassword.bind(authController),
);

authRouter.post(
  "/refresh-token",
  cookieAuthGuard,
  checkUserInReq,
  authController.refreshTokens.bind(authController),
);

authRouter.post(
  "/logout",
  cookieAuthGuard,
  checkUserInReq,
  authController.logout.bind(authController),
);

authRouter.post(
  "/registration-confirmation",
  rateLimiter,
  validateConfirmEmailBody,
  validationChainResult,
  authController.confirmEmail.bind(authController),
);

authRouter.post(
  "/registration-email-resending",
  rateLimiter,
  validateEmailBody,
  validationChainResult,
  authController.resendEmail.bind(authController),
);

authRouter.get(
  "/me",
  jwtAuthGuard,
  checkUserInReq,
  authController.getMyInfo.bind(authController),
);

authRouter.post(
  "/registration",
  rateLimiter,
  validateUserBody,
  validationChainResult,
  authController.registerUser.bind(authController),
);
