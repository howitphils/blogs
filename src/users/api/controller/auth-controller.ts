import { Response } from "express";
import { RequestWithBody } from "../../../core/types/request-types";
import { LoginInputModel } from "../../types/users-types";

export const authController = {
  async loginUser(req: RequestWithBody<LoginInputModel>, res: Response) {},
};
