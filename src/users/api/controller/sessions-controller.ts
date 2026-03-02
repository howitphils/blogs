import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParamsId } from "../../../core/types/request-types";
import { SessionViewModel } from "../../types/sessions-types";
import { UsersService } from "../../application/users-service";
import { UsersQueryRepository } from "../../repository/users-query-repository";
import { inject, injectable } from "inversify";

@injectable()
export class SessionsController {
  constructor(
    @inject(UsersService)
    private usersService: UsersService,

    @inject(UsersQueryRepository)
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async getSessions(req: Request, res: Response<SessionViewModel[]>) {
    const { userId } = req.user;

    const sessions = await this.usersQueryRepository.getUsersSessions(userId);

    return res.status(HttpStatus.OK).json(sessions);
  }

  async deleteSession(req: RequestWithParamsId, res: Response) {
    const { id: deviceId } = req.params; // taking deviceId from params to be able to delete any user's session, not only current
    const { userId } = req.user;

    await this.usersService.deleteUsersSession(deviceId, userId);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  async deleteAllSessions(req: Request, res: Response) {
    const { userId, deviceId } = req.user;

    await this.usersService.deleteAllUsersSessions(userId, deviceId as string);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
