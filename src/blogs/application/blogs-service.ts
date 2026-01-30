import { ErrorResponseWithMessage } from "../../core/middlewares/error-handling/error-handler";
import { HttpStatus } from "../../core/types/http-status-types";
import { postsRepository } from "../../posts/repository/posts-repository";
import { blogsRepository } from "../repository/blogs-repository";
import {
  BlogDbModel,
  BlogInputModel,
  UpdateBlogDtoModel,
} from "../types/blogs-types";

export const blogsService = {
  async getBlogById(id: string) {
    return blogsRepository.getBlogByIdOrFail(id);
  },

  async createBlog(dto: BlogInputModel) {
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
      throw new ErrorResponseWithMessage(
        "Blog was not found",
        HttpStatus.NOT_FOUND,
      );
    }
  },

  async deleteBlog(blogId: string): Promise<void> {
    const result = await blogsRepository.deleteBlog(blogId);

    if (!result) {
      throw new ErrorResponseWithMessage(
        "Blog was not found",
        HttpStatus.NOT_FOUND,
      );
    }
  },
};
