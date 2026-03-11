import { calculatePagesCount } from "./../../core/utils/calculate-pages-count";
import {
  BlogDbDocument,
  BlogQueryParams,
  BlogViewModel,
} from "../types/blogs-types";
import { PaginationType } from "../../core/types/pagination-types";
import { BlogNotFoundError } from "../application/errors/blogs-errors";
import { injectable } from "inversify";
import { BlogModel } from "./schemas/blog-schema";

@injectable()
export class BlogsQueryRepository {
  async getBlogs(
    params: BlogQueryParams,
  ): Promise<PaginationType<BlogViewModel>> {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      params;

    const skip = (pageNumber - 1) * pageSize;

    const filter = searchNameTerm
      ? { name: { $regex: searchNameTerm, $options: "i" } }
      : {};

    const blogs = await BlogModel.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection });

    const totalCount = await BlogModel.countDocuments(filter);

    return {
      page: pageNumber,
      pagesCount: calculatePagesCount(totalCount, pageSize),
      pageSize,
      totalCount,
      items: blogs.map(this.mapFromDbToView),
    };
  }

  async getBlogByIdOrFail(id: string): Promise<BlogViewModel> {
    const dbBlog = await BlogModel.findById(id).orFail(new BlogNotFoundError());

    return this.mapFromDbToView(dbBlog);
  }

  private mapFromDbToView(blog: BlogDbDocument): BlogViewModel {
    return {
      id: blog._id.toString(),
      description: blog.description,
      name: blog.name,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMemberShip: blog.isMemberShip,
    };
  }
}
