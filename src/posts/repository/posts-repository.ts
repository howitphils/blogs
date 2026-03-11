import {
  PostDbDocument,
  PostDbModel,
  UpdatePostDtoModel,
} from "../types/posts-types";
import { PostNotFoundError } from "../application/errors/posts-errors";
import { injectable } from "inversify";
import { PostModel } from "./schemas/post-schema";

@injectable()
export class PostsRepository {
  async createPost(dto: PostDbModel): Promise<string> {
    const post = await PostModel.insertOne(dto);

    return post.id;
  }

  async getPostByIdOrFail(postId: string): Promise<PostDbDocument> {
    return PostModel.findById(postId).orFail(new PostNotFoundError());
  }

  async updatePost(dto: UpdatePostDtoModel): Promise<void> {
    await PostModel.findByIdAndUpdate(dto.id, {
      title: dto.title,
      blogId: dto.blogId,
      content: dto.content,
      shortDescription: dto.shortDescription,
    }).orFail(new PostNotFoundError());
  }

  async deletePost(postId: string): Promise<void> {
    await PostModel.findByIdAndDelete(postId).orFail(new PostNotFoundError());
  }

  async updateBlogNameForPost(blogId: string, blogName: string): Promise<void> {
    await PostModel.updateMany({ blogId }, { blogName });
  }
}
