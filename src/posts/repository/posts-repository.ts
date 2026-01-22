import { db } from "../../db/db";
import {
  PostInputModel,
  PostViewModel,
  UpdatePostDtoModel,
} from "../types/posts-types";

export const postsRepository = {
  async createPost(dto: PostInputModel): Promise<PostViewModel | null> {
    const blog = db.blogs.find((b) => b.id === dto.blogId);

    if (!blog) {
      return null;
    }

    const newPost: PostViewModel = {
      id: (db.posts.length + 1).toString(),
      title: dto.title,
      content: dto.content,
      shortDescription: dto.shortDescription,
      blogId: dto.blogId,
      blogName: blog.name || "Unknown Blog",
    };

    db.posts.unshift(newPost);

    return newPost;
  },

  async getPostById(postId: string): Promise<PostViewModel | null> {
    return db.posts.find((post) => post.id === postId) || null;
  },

  async updatePost(dto: UpdatePostDtoModel): Promise<boolean> {
    const post = db.posts.find((p) => p.id === dto.id);
    if (!post) {
      return false;
    }

    post.title = dto.title;
    post.content = dto.content;
    post.shortDescription = dto.shortDescription;
    post.blogId = dto.blogId;

    return true;
  },

  async deletePost(postId: number): Promise<boolean> {
    const postIndex = db.posts.findIndex((p) => p.id === postId.toString());

    if (postIndex === -1) {
      return false;
    }

    db.posts.splice(postIndex, 1);

    return true;
  },

  async getAllPosts(): Promise<PostViewModel[]> {
    return db.posts;
  },
};
