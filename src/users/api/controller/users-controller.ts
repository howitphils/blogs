import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-status-types";
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
import { usersService } from "../../application/users-service";
import { PaginationType } from "../../../core/types/pagination-types";
import { matchedData } from "express-validator";
import { usersQueryRepository } from "../../repository/users-query-repository";

export const usersController = {
  getUsers: async (
    req: RequestWithQuery<UserQueryParams>,
    res: Response<PaginationType<UserViewModel>>,
  ): Promise<Response> => {
    const sortParams = matchedData<UserQueryParams>(req);

    const blogs = await usersQueryRepository.getUsers(sortParams);

    return res.status(HttpStatus.OK).json(blogs);
  },

  createUser: async (
    req: RequestWithBody<UserInputModel>,
    res: Response<UserViewModel>,
  ): Promise<Response> => {
    const newUserId = await usersService.createUser(req.body);

    const newUser = await usersQueryRepository.getCreatedUser(newUserId);

    return res.status(HttpStatus.CREATED).json(newUser);
  },

  deleteUser: async (
    req: RequestWithParamsId,
    res: Response,
  ): Promise<Response> => {
    const blogId = req.params.id;

    await usersService.deleteUser(blogId);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  },
};
