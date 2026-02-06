import { Request, Response } from "express";
import { RequestWithBody } from "../../../core/types/request-types";
import { LoginInputModel, MeInfoViewModel } from "../../types/users-types";
import { usersService } from "../../application/users-service";
import { HttpStatus } from "../../../core/types/http-status-types";
import { usersQueryRepository } from "../../repository/users-query-repository";

export const authController = {
  async loginUser(req: RequestWithBody<LoginInputModel>, res: Response) {
    const token = await usersService.loginUser(req.body);

    return res.status(HttpStatus.NO_CONTENT).json(token);
  },

  async getMyInfo(req: Request, res: Response<MeInfoViewModel>) {
    const userId = req.user.userId;

    const userInfo = await usersQueryRepository.getMyInfo(userId);

    return res.status(HttpStatus.OK).json(userInfo);
  },
};
