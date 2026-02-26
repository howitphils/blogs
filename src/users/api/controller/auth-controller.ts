import { Request, Response } from "express";
import { RequestWithBody } from "../../../core/types/request-types";
import { UserInputModel } from "../../types/users-types";
import { usersService } from "../../application/users-service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { usersQueryRepository } from "../../repository/users-query-repository";
import {
  AccessTokenOutput,
  ConfirmEmailBody,
  LoginInfo,
  LoginInputModel,
  MeInfoViewModel,
  NewPasswordBody,
  EmailBody,
} from "../../types/auth-types";
import { appConfig } from "../../../app-config";
import { CookieTTL } from "../../../core/types/cookie-ttl-enum";
import { authCookieOptions } from "./cookie-options/auth-cookie-options";

export const authController = {
  async loginUser(
    req: RequestWithBody<LoginInputModel>,
    res: Response<AccessTokenOutput>,
  ) {
    const deviceName = req.headers["user-agent"] || "Unknown device";
    const ip = req.ip as string;

    const loginInfoDto: LoginInfo = {
      loginOrEmail: req.body.loginOrEmail,
      password: req.body.password,
      ip,
      deviceName,
    };

    const { accessToken, refreshToken } =
      await usersService.loginUser(loginInfoDto);

    res.cookie(appConfig.REFRESH_COOKIE_NAME, refreshToken, {
      ...authCookieOptions,
      maxAge: CookieTTL.SEVEN_DAYS,
    });

    return res.status(HttpStatus.OK).json({ accessToken });
  },

  async recoverPassword(req: RequestWithBody<EmailBody>, res: Response) {
    const email = req.body.email;

    await usersService.recoverPassword(email);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  },

  async updatePassword(req: RequestWithBody<NewPasswordBody>, res: Response) {
    const { newPassword, recoveryCode } = req.body;

    await usersService.updatePassword(newPassword, recoveryCode);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  },

  async refreshTokens(req: Request, res: Response<AccessTokenOutput>) {
    const { userId, deviceId } = req.user;

    const { accessToken, refreshToken } = await usersService.refreshTokens(
      userId,
      deviceId as string,
    );

    res.cookie(appConfig.REFRESH_COOKIE_NAME, refreshToken, {
      ...authCookieOptions,
      maxAge: CookieTTL.ONE_DAY,
    });

    return res.status(HttpStatus.OK).json({ accessToken });
  },

  async logout(req: Request, res: Response<void>) {
    const { userId, deviceId } = req.user;

    await usersService.logout(userId, deviceId as string);

    res.clearCookie(appConfig.REFRESH_COOKIE_NAME, authCookieOptions);

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

  async resendEmail(req: RequestWithBody<EmailBody>, res: Response<void>) {
    const email = req.body.email;

    await usersService.emailResending(email);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  },
};
