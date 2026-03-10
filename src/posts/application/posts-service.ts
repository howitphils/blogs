import { PostsRepository } from "./../repository/posts-repository";
import { inject, injectable } from "inversify";
import { BlogsRepository } from "../../blogs/repository/blogs-repository";
import {
  PostDbModel,
  PostInputModel,
  UpdatePostDtoModel,
} from "../types/posts-types";
import { PostNotFoundError } from "./errors/posts-errors";

@injectable()
export class PostsService {
  constructor(
    @inject(BlogsRepository) private blogsRepository: BlogsRepository,
    @inject(PostsRepository) private postsRepository: PostsRepository,
  ) {}

  async createPost(dto: PostInputModel): Promise<string> {
    const blog = await this.blogsRepository.getBlogByIdOrFail(dto.blogId);

    const newPost: PostDbModel = {
      title: dto.title,
      blogId: dto.blogId,
      blogName: blog.name,
      content: dto.content,
      createdAt: new Date().toISOString(),
      shortDescription: dto.shortDescription,
    };

    return this.postsRepository.createPost(newPost);
  }

  async updatePost(dto: UpdatePostDtoModel): Promise<void> {
    const updateResult = await this.postsRepository.updatePost(dto);

    if (!updateResult) {
      throw new PostNotFoundError();
    }
  }

  async deletePost(postId: string): Promise<void> {
    const deleteResult = await this.postsRepository.deletePost(postId);

    if (!deleteResult) {
      throw new PostNotFoundError();
    }
  }
}
