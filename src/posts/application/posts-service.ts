import { PostsRepository } from "./../repository/posts-repository";
import { inject, injectable } from "inversify";
import { BlogsRepository } from "../../blogs/repository/blogs-repository";
import {
  PostDbModel,
  PostInputModel,
  UpdatePostDtoModel,
} from "../types/posts-types";

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
      likes: [],
      dislikesCount: 0,
      likesCount: 0,
    };

    return this.postsRepository.createPost(newPost);
  }

  async updatePost(dto: UpdatePostDtoModel): Promise<void> {
    await this.postsRepository.updatePost(dto);
  }

  async deletePost(postId: string): Promise<void> {
    await this.postsRepository.deletePost(postId);
  }
}
