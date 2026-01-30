import { postsCollection } from "./../../db/mongodb";
import { blogsRepository } from "../../blogs/repository/blogs-repository";
import {
  PostDbModel,
  PostInputModel,
  UpdatePostDtoModel,
} from "../types/posts-types";
import { ObjectId } from "mongodb";
import { ErrorResponseWithMessage } from "../../core/middlewares/error-handling/error-handler";
import { HttpStatus } from "../../core/types/http-status-types";

export const postsRepository = {
  async createPost(dto: PostInputModel): Promise<string> {
    const blog = await blogsRepository.getBlogByIdOrFail(dto.blogId);

    const newPost: PostDbModel = {
      title: dto.title,
      content: dto.content,
      shortDescription: dto.shortDescription,
      blogId: dto.blogId,
      blogName: blog.name || "Unknown Blog",
      createdAt: new Date().toISOString(),
    };

    const { insertedId } = await postsCollection.insertOne(newPost);

    return insertedId.toString();
  },

  async getPostByIdOrFail(postId: string): Promise<PostDbModel> {
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      throw new ErrorResponseWithMessage(
        "Post was not found",
        HttpStatus.NOT_FOUND,
      );
    }

    return post;
  },

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
  },

  async deletePost(postId: string): Promise<boolean> {
    const deleteResult = await postsCollection.deleteOne({
      _id: new ObjectId(postId),
    });

    return deleteResult.deletedCount !== 0;
  },

  async updateBlogNameForPost(blogId: string, blogName: string) {
    const updateResult = await postsCollection.updateMany(
      { blogId },
      {
        $set: {
          blogName,
        },
      },
    );

    return updateResult.matchedCount !== 0;
  },
};
