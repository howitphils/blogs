import { Request, Response } from "express";
import { RequestWithBody } from "../../../core/types/request-types";
import { UserInputModel } from "../../types/users-types";
import { usersService } from "../../application/users-service";
import { HttpStatus } from "../../../core/types/http-status-types";
import { usersQueryRepository } from "../../repository/users-query-repository";
import {
  AccessTokenOutput,
  ConfirmEmailBody,
  LoginInputModel,
  MeInfoViewModel,
  ResendEmailBody,
} from "../../types/auth-types";
import { appConfig } from "../../../app-config";
import { CookieTTL } from "../../../core/types/cookie-ttl-enum";

export const authController = {
  async loginUser(
    req: RequestWithBody<LoginInputModel>,
    res: Response<AccessTokenOutput>,
  ) {
    const { accessToken, refreshToken } = await usersService.loginUser(
      req.body,
    );

    res.cookie(appConfig.REFRESH_COOKIE_NAME, refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: CookieTTL.SEVEN_DAYS,
      sameSite: "none",
    });

    return res.status(HttpStatus.OK).json({ accessToken });
  },

  async refreshTokens(req: Request, res: Response<AccessTokenOutput>) {
    const userId = req.user.userId;

    const { accessToken, refreshToken } =
      await usersService.refreshTokens(userId);

    res.cookie(appConfig.REFRESH_COOKIE_NAME, refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: CookieTTL.SEVEN_DAYS,
      sameSite: "none",
    });

    return res.status(HttpStatus.OK).json({ accessToken });
  },

  async logout(req: Request, res: Response<void>) {
    const userId = req.user.userId;

    await usersService.logout(userId);

    res.clearCookie(appConfig.REFRESH_COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.sendStatus(HttpStatus.NO_CONTENT);
  },

  async getMyInfo(req: Request, res: Response<MeInfoViewModel>) {
    const userId = req.user.userId;

    const userInfo = await usersQueryRepository.getMyInfo(userId);

    return res.status(HttpStatus.OK).json(userInfo);
  },

  async registerUser(
    req: RequestWithBody<UserInputModel>,
    res: Response<void>,
  ) {
    const userDto = req.body;

    await usersService.registerUser(userDto);

    res.sendStatus(HttpStatus.NO_CONTENT);
  },

  async confirmEmail(
    req: RequestWithBody<ConfirmEmailBody>,
    res: Response<void>,
  ) {
    const code = req.body.code;

    await usersService.confirmEmail(code);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  },

  async resendEmail(
    req: RequestWithBody<ResendEmailBody>,
    res: Response<void>,
  ) {
    const email = req.body.email;

    await usersService.emailResending(email);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  },
};
