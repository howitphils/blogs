import { ObjectId, WithId } from "mongodb";
import {
  BlogDbModel,
  BlogQueryParams,
  BlogViewModel,
} from "../types/blogs-types";
import { blogsCollection } from "../../db/mongodb";
import { PaginationType } from "../../core/types/pagination-types";
import {
  BlogNotFoundError,
  BlogNotFoundInternalError,
} from "../application/errors/blogs-errors";

export const blogsQueryRepository = {
  async getBlogs(
    params: BlogQueryParams,
  ): Promise<PaginationType<BlogViewModel>> {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      params;

    const skip = (pageNumber - 1) * pageSize;

    const filter = searchNameTerm
      ? { name: { $regex: searchNameTerm, $options: "i" } }
      : {};

    const blogs = await blogsCollection
      .find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const totalCount = await blogsCollection.countDocuments(filter);

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize,
      totalCount,
      items: blogs.map(blogsQueryRepository.mapFromDbToView),
    };
  },

  async getBlogByIdOrFail(id: string): Promise<BlogViewModel> {
    const dbBlog = await blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!dbBlog) {
      throw new BlogNotFoundError();
    }

    return blogsQueryRepository.mapFromDbToView(dbBlog);
  },

  async getCreatedBlog(id: string): Promise<BlogViewModel> {
    const dbBlog = await blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!dbBlog) {
      throw new BlogNotFoundInternalError();
    }

    return blogsQueryRepository.mapFromDbToView(dbBlog);
  },

  mapFromDbToView(blog: WithId<BlogDbModel>): BlogViewModel {
    return {
      id: blog._id.toString(),
      description: blog.description,
      name: blog.name,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMemberShip: blog.isMemberShip,
    };
  },
};
