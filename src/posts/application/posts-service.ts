import { blogsRepository } from "../../blogs/repository/blogs-repository";
import { postsRepository } from "../repository/posts-repository";
import {
  PostDbModel,
  PostInputModel,
  UpdatePostDtoModel,
} from "../types/posts-types";
import { PostNotFoundError } from "./errors/posts-errors";

export const postsService = {
  async createPost(dto: PostInputModel): Promise<string> {
    const blog = await blogsRepository.getBlogByIdOrFail(dto.blogId);

    const newPost: PostDbModel = {
      title: dto.title,
      blogId: dto.blogId,
      blogName: blog.name,
      content: dto.content,
      createdAt: new Date().toISOString(),
      shortDescription: dto.shortDescription,
    };

    return postsRepository.createPost(newPost);
  },

  async updatePost(dto: UpdatePostDtoModel): Promise<void> {
    const updateResult = await postsRepository.updatePost(dto);

    if (!updateResult) {
      throw new PostNotFoundError();
    }
  },

  async deletePost(postId: string): Promise<void> {
    const deleteResult = await postsRepository.deletePost(postId);

    if (!deleteResult) {
      throw new PostNotFoundError();
    }
  },
};
