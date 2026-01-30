import { blogsRepository } from "../../blogs/repository/blogs-repository";
import { postsRepository } from "../repository/posts-repository";
import {
  PostDbModel,
  PostInputModel,
  UpdatePostDtoModel,
} from "../types/posts-types";

export const postsService = {
  async getPostById(id: string): Promise<PostDbModel> {
    const post = await postsRepository.getPostByIdOrFail(id);

    return post;
  },

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

  async updatePost(dto: UpdatePostDtoModel): Promise<boolean> {
    return postsRepository.updatePost(dto);
  },

  async deletePost(blogId: string): Promise<boolean> {
    return postsRepository.deletePost(blogId);
  },
};
