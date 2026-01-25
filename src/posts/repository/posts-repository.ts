import { postsCollection } from "./../../db/mongodb";
import { blogsRepository } from "../../blogs/repository/blogs-repository";
import {
  PostDbModel,
  PostInputModel,
  UpdatePostDtoModel,
} from "../types/posts-types";
import { ObjectId } from "mongodb";

export const postsRepository = {
  async createPost(dto: PostInputModel): Promise<string | null> {
    const blog = await blogsRepository.getBlogById(dto.blogId);

    if (!blog) {
      return null;
    }

    const newPost: PostDbModel = {
      title: dto.title,
      content: dto.content,
      shortDescription: dto.shortDescription,
      blogId: dto.blogId,
      blogName: blog.name || "Unknown Blog", // TODO: check for blog name
    };

    const { insertedId } = await postsCollection.insertOne(newPost);

    return insertedId.toString();
  },

  async getPostById(postId: string): Promise<PostDbModel | null> {
    return postsCollection.findOne({ _id: new ObjectId(postId) });
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
};
