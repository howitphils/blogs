import { Request, Response } from "express";
import { RequestWithBody } from "../../../core/types/request-types";
import { UserInputModel } from "../../types/users-types";
import { usersService } from "../../application/users-service";
import { HttpStatus } from "../../../core/types/http-status-types";
import { usersQueryRepository } from "../../repository/users-query-repository";
import {
  ConfirmEmailBody,
  LoginInputModel,
  LoginOutputModel,
  MeInfoViewModel,
  ResendEmailBody,
} from "../../types/auth-types";

export const authController = {
  async loginUser(
    req: RequestWithBody<LoginInputModel>,
    res: Response<LoginOutputModel>,
  ) {
    const token = await usersService.loginUser(req.body);

    return res.status(HttpStatus.OK).json(token);
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
