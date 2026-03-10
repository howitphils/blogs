import { postsCollection } from "./../../db/mongodb";
import { PostDbModel, UpdatePostDtoModel } from "../types/posts-types";
import { ObjectId } from "mongodb";
import { PostNotFoundError } from "../application/errors/posts-errors";
import { injectable } from "inversify";

@injectable()
export class PostsRepository {
  async createPost(dto: PostDbModel): Promise<string> {
    const { insertedId } = await postsCollection.insertOne(dto);

    return insertedId.toString();
  }

  async getPostByIdOrFail(postId: string): Promise<PostDbModel> {
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      throw new PostNotFoundError();
    }

    return post;
  }

  async updatePost(dto: UpdatePostDtoModel): Promise<boolean> {
    const updateResult = await postsCollection.updateOne(
      { _id: new ObjectId(dto.id) },
      {
        $set: {
          title: dto.title,
          blogId: dto.blogId,
          content: dto.content,
          shortDescription: dto.shortDescription,
        },
      },
    );

    return updateResult.matchedCount !== 0;
  }

  async deletePost(postId: string): Promise<boolean> {
    const deleteResult = await postsCollection.deleteOne({
      _id: new ObjectId(postId),
    });

    return deleteResult.deletedCount !== 0;
  }

  async updateBlogNameForPost(blogId: string, blogName: string): Promise<void> {
    await postsCollection.updateMany(
      { blogId },
      {
        $set: {
          blogName,
        },
      },
    );
  }
}
