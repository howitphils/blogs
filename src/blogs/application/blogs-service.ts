import { BlogsRepository } from "./../repository/blogs-repository";
import { inject, injectable } from "inversify";
import { ServerError } from "../../core/middlewares/error-handling/custom-errors/server-error";
import {
  BlogDbModel,
  BlogInputModel,
  UpdateBlogDtoModel,
} from "../types/blogs-types";
import { PostsRepository } from "../../posts/repository/posts-repository";

@injectable()
export class BlogsService {
  constructor(
    @inject(BlogsRepository) private blogsRepository: BlogsRepository,
    @inject(PostsRepository) private postsRepository: PostsRepository,
  ) {}

  async createBlog(dto: BlogInputModel): Promise<string> {
    const newBlog: BlogDbModel = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMemberShip: false,
    };

    return this.blogsRepository.createBlog(newBlog);
  }

  async updateBlog(dto: UpdateBlogDtoModel): Promise<void> {
    const blog = await this.blogsRepository.getBlogByIdOrFail(dto.blogId);

    if (blog.name !== dto.name) {
      await this.postsRepository.updateBlogNameForPost(dto.blogId, dto.name);
    }

    const updateResult = await this.blogsRepository.updateBlog(dto);

    if (!updateResult) {
      throw new ServerError("Blog was not updated");
    }
  }

  async deleteBlog(blogId: string): Promise<void> {
    await this.blogsRepository.getBlogByIdOrFail(blogId);

    const result = await this.blogsRepository.deleteBlog(blogId);

    if (!result) {
      throw new ServerError("Blog was not deleted");
    }
  }
}
