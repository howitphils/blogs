import { postsRepository } from "../../posts/repository/posts-repository";
import { blogsRepository } from "../repository/blogs-repository";
import {
  BlogDbModel,
  BlogInputModel,
  UpdateBlogDtoModel,
} from "../types/blogs-types";

export const blogsService = {
  async getBlogById(id: string) {
    return blogsRepository.getBlogById(id);
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

  async updateBlog(dto: UpdateBlogDtoModel): Promise<boolean> {
    const blog = await blogsRepository.getBlogById(dto.blogId);

    if (!blog) {
      return false;
    }

    if (blog.name !== dto.name) {
      await postsRepository.updateBlogNameForPost(dto.blogId, dto.name);
    }

    return blogsRepository.updateBlog(dto);
  },

  async deleteBlog(blogId: string) {
    return blogsRepository.deleteBlog(blogId);
  },
};
