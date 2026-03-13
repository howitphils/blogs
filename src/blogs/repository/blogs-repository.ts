import {
  BlogDbDocument,
  BlogDbModel,
  UpdateBlogDtoModel,
} from "../types/blogs-types";
import { BlogNotFoundError } from "../application/errors/blogs-errors";
import { injectable } from "inversify";
import { BlogModel } from "./schemas/blog-schema";

@injectable()
export class BlogsRepository {
  async getBlogByIdOrFail(blogId: string): Promise<BlogDbDocument> {
    return BlogModel.findById(blogId).orFail(new BlogNotFoundError());
  }

  async createBlog(blogDto: BlogDbModel): Promise<string> {
    const blog = await BlogModel.insertOne(blogDto);

    return blog.id;
  }

  async updateBlog(dto: UpdateBlogDtoModel): Promise<BlogDbDocument> {
    return BlogModel.findByIdAndUpdate(dto.blogId, {
      description: dto.description,
      name: dto.name,
      websiteUrl: dto.websiteUrl,
    }).orFail(new BlogNotFoundError());
  }

  async deleteBlog(blogId: string): Promise<BlogDbDocument> {
    return BlogModel.findByIdAndDelete(blogId).orFail(new BlogNotFoundError());
  }
}
