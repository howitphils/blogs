import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { usersQueryRepository } from "../../repository/users-query-repository";
import { RequestWithParamsId } from "../../../core/types/request-types";
import { SessionViewModel } from "../../types/sessions-types";
import { usersService } from "../../application/users-service";

export const sessionsController = {
  async getSessions(req: Request, res: Response<SessionViewModel[]>) {
    const { userId } = req.user;

    const sessions = await usersQueryRepository.getUsersSessions(userId);

    return res.status(HttpStatus.OK).json(sessions);
  },

  async deleteSession(req: RequestWithParamsId, res: Response) {
    const { id: deviceId } = req.params; // taking deviceId from params to be able to delete any user's session, not only current
    const { userId } = req.user;

    await usersService.deleteUsersSession(deviceId, userId);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  },

  async deleteAllSessions(req: Request, res: Response) {
    const { userId, deviceId } = req.user;

    await usersService.deleteAllUsersSessions(userId, deviceId);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  },
};
