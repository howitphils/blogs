import { ServerError } from "../../core/middlewares/error-handling/custom-errors/server-error";
import { postsRepository } from "../../posts/repository/posts-repository";
import { blogsRepository } from "../repository/blogs-repository";
import {
  BlogDbModel,
  BlogInputModel,
  UpdateBlogDtoModel,
} from "../types/blogs-types";

export const blogsService = {
  async createBlog(dto: BlogInputModel): Promise<string> {
    const newBlog: BlogDbModel = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMemberShip: false,
    };

    return blogsRepository.createBlog(newBlog);
  },

  async updateBlog(dto: UpdateBlogDtoModel): Promise<void> {
    const blog = await blogsRepository.getBlogByIdOrFail(dto.blogId);

    if (blog.name !== dto.name) {
      await postsRepository.updateBlogNameForPost(dto.blogId, dto.name);
    }

    const updateResult = await blogsRepository.updateBlog(dto);

    if (!updateResult) {
      throw new ServerError("Blog was not updated");
    }
  },

  async deleteBlog(blogId: string): Promise<void> {
    await blogsRepository.getBlogByIdOrFail(blogId);

    const result = await blogsRepository.deleteBlog(blogId);

    if (!result) {
      throw new ServerError("Blog was not deleted");
    }
  },
};
