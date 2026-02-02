import { ObjectId, WithId } from "mongodb";
import { usersCollection } from "../../db/mongodb";
import { PaginationType } from "../../core/types/pagination-types";
import {
  UserDbModel,
  UserQueryParams,
  UserViewModel,
} from "../types/users-types";
import { calculateSkip } from "../../core/utils/calculate-skip";
import { UserNotFoundInternalError } from "../application/errors/users-errors";
import { calculatePagesCount } from "../../core/utils/calculate-pages-count";
import { createUserFilter } from "../utils/create-user-filter";

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
      .sort({ [sortBy]: sortDirection })
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
      throw new UserNotFoundInternalError();
    }

    return usersQueryRepository.mapFromDbToView(user);
  },

  mapFromDbToView(user: WithId<UserDbModel>): UserViewModel {
    return {
      id: user._id.toString(),
      email: user.email,
      login: user.login,
      createdAt: user.createAt,
    };
  },
};
