import { Response } from "express";
import { RequestWithBody } from "../../../core/types/request-types";
import { LoginInputModel } from "../../types/users-types";
import { usersService } from "../../application/users-service";
import { HttpStatus } from "../../../core/types/http-status-types";

export const authController = {
  async loginUser(req: RequestWithBody<LoginInputModel>, res: Response) {
    const token = await usersService.loginUser(req.body);

    return res.status(HttpStatus.NO_CONTENT).json(token);
  },
};
