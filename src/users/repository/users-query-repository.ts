import { PaginationType } from "../../core/types/pagination-types";
import {
  UserDbDocumentType,
  UserQueryParams,
  UserViewModel,
} from "../types/users-types";
import { calculateSkip } from "../../core/utils/calculate-skip";
import { calculatePagesCount } from "../../core/utils/calculate-pages-count";
import { createUserFilter } from "../utils/create-user-filter";
import { UserNotFoundError } from "../application/errors/users-errors";
import { MeInfoViewModel } from "../types/auth-types";
import { SessionViewModel } from "../types/sessions-types";
import { injectable } from "inversify";
import { UserModel } from "./schemas/user/user-schema";
import { SessionModel } from "./schemas/sessions/session-schema";

@injectable()
export class UsersQueryRepository {
  async getUsers(
    params: UserQueryParams,
  ): Promise<PaginationType<UserViewModel>> {
    const {
      pageNumber,
      pageSize,
      searchEmailTerm,
      searchLoginTerm,
      sortBy,
      sortDirection,
    } = params;

    const filter = createUserFilter(searchLoginTerm, searchEmailTerm);

    const users = await UserModel.find(filter)
      .skip(calculateSkip(pageNumber, pageSize))
      .limit(pageSize)
      .sort({ [`accountData.${sortBy}`]: sortDirection });

    const totalCount = await UserModel.countDocuments(filter);

    return {
      page: pageNumber,
      pagesCount: calculatePagesCount(totalCount, pageSize),
      pageSize,
      totalCount,
      items: users.map(this.mapFromDbToView),
    };
  }

  async getUserByIdOrFail(id: string): Promise<UserViewModel> {
    const user = await UserModel.findById(id).orFail(new UserNotFoundError());

    return this.mapFromDbToView(user);
  }

  async getMyInfo(userId: string): Promise<MeInfoViewModel> {
    const user = await UserModel.findById(userId).orFail(
      new UserNotFoundError(),
    );

    return {
      userId: user.id,
      login: user.accountData.login,
      email: user.accountData.email,
    };
  }

  async getUsersSessions(userId: string): Promise<SessionViewModel[]> {
    const sessions = await SessionModel.find({ userId });

    return sessions.map((session) => ({
      ip: session.ip,
      deviceId: session.deviceId,
      lastActiveDate: session.iat,
      title: session.deviceName,
    }));
  }

  mapFromDbToView(user: UserDbDocumentType): UserViewModel {
    return {
      id: user.id,
      email: user.accountData.email,
      login: user.accountData.login,
      createdAt: user.accountData.createdAt,
    };
  }
}
