import { ObjectId, WithId } from "mongodb";
import { usersCollection } from "../../db/mongodb";
import { PaginationType } from "../../core/types/pagination-types";
import {
  UserDbModel,
  UserQueryParams,
  UserViewModel,
} from "../types/users-types";
import { calculateSkip } from "../../core/utils/calculate-skip";
import { calculatePagesCount } from "../../core/utils/calculate-pages-count";
import { createUserFilter } from "../utils/create-user-filter";
import { ServerError } from "../../core/middlewares/error-handling/custom-errors/server-error";
import { UserNotFoundError } from "../application/errors/users-errors";
import { MeInfoViewModel } from "../types/auth-types";

export const usersQueryRepository = {
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

    const users = await usersCollection
      .find(filter)
      .skip(calculateSkip(pageNumber, pageSize))
      .limit(pageSize)
      .sort({ [`accountData.${sortBy}`]: sortDirection })
      .toArray();
    const totalCount = await usersCollection.countDocuments(filter);

    return {
      page: pageNumber,
      pagesCount: calculatePagesCount(totalCount, pageSize),
      pageSize,
      totalCount,
      items: users.map(usersQueryRepository.mapFromDbToView),
    };
  },

  async getCreatedUser(id: string): Promise<UserViewModel> {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      throw new ServerError("Created user is not found");
    }

    return usersQueryRepository.mapFromDbToView(user);
  },

  async getMyInfo(userId: string): Promise<MeInfoViewModel> {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      throw new UserNotFoundError();
    }

    return {
      login: user.accountData.login,
      email: user.accountData.email,
      userId: user._id.toString(),
    };
  },

  mapFromDbToView(user: WithId<UserDbModel>): UserViewModel {
    return {
      id: user._id.toString(),
      email: user.accountData.email,
      login: user.accountData.login,
      createdAt: user.accountData.createdAt,
    };
  },
};
