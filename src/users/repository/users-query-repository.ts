import { WithId } from "mongodb";
import { blogsCollection } from "../../db/mongodb";
import { PaginationType } from "../../core/types/pagination-types";
import {
  UserDbModel,
  UserQueryParams,
  UserViewModel,
} from "../types/users-types";

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

    const skip = (pageNumber - 1) * pageSize;

    // const filter = searchNameTerm
    //   ? { name: { $regex: searchNameTerm, $options: "i" } }
    //   : {};

    const blogs = await blogsCollection
      .find()
      .skip(skip)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const totalCount = await blogsCollection.countDocuments();

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize,
      totalCount,
      items: blogs.map(usersQueryRepository.mapFromDbToView),
    };
  },

  mapFromDbToView(blog: WithId<UserDbModel>): UserViewModel {
    return {};
  },
};
