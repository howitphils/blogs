import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import {
  RequestWithParamsId,
  RequestWithBody,
  RequestWithQuery,
} from "../../../core/types/request-types";
import {
  UserInputModel,
  UserViewModel,
  UserQueryParams,
} from "../../types/users-types";
import { PaginationType } from "../../../core/types/pagination-types";
import { matchedData } from "express-validator";
import { UsersService } from "../../application/users-service";
import { UsersQueryRepository } from "../../repository/users-query-repository";
import { inject, injectable } from "inversify";

@injectable()
export class UsersController {
  constructor(
    @inject(UsersService)
    private usersService: UsersService,

    @inject(UsersQueryRepository)
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  async getUsers(
    req: RequestWithQuery<UserQueryParams>,
    res: Response<PaginationType<UserViewModel>>,
  ): Promise<Response> {
    const sortParams = matchedData<UserQueryParams>(req);

    const users = await this.usersQueryRepository.getUsers(sortParams);

    return res.status(HttpStatus.OK).json(users);
  }

  async createUser(
    req: RequestWithBody<UserInputModel>,
    res: Response<UserViewModel>,
  ): Promise<Response> {
    const newUserId = await this.usersService.addUser(req.body);

    const newUser =
      await this.usersQueryRepository.getUserByIdOrFail(newUserId);

    return res.status(HttpStatus.CREATED).json(newUser);
  }

  async deleteUser(req: RequestWithParamsId, res: Response): Promise<Response> {
    const userId = req.params.id;

    await this.usersService.deleteUser(userId);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
