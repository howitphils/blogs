import { ObjectId } from "mongodb";
import { db } from "../../db/db";
import { blogsCollection } from "../../db/mongodb";
import {
  BlogDbModel,
  BlogInputModel,
  BlogViewModel,
} from "../types/blogs-types";

export const blogsRepository = {
  async getAllBlogs(): Promise<BlogDbModel[]> {
    return blogsCollection.find({}).toArray();
  },

  async getBlogById(blogId: string): Promise<BlogViewModel | null> {
    const convertedId = new ObjectId(blogId);

    const blog = await blogsCollection.findOne({ _id: convertedId });

    if (!blog) {
      return null;
    }

    return {
      id: blog._id.toString(),
      description: blog.description,
      name: blog.name,
      websiteUrl: blog.websiteUrl,
    };
  },

  async createBlog(blogDto: BlogInputModel): Promise<string> {
    const newBlog: BlogDbModel = {
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
    };

    const { insertedId } = await blogsCollection.insertOne(newBlog);

    return insertedId.toString();
  },

  async updateBlog(
    blogId: string,
    blogDto: BlogInputModel,
  ): Promise<BlogViewModel | null> {
    const blog = db.blogs.find((b) => b.id === blogId);

    if (!blog) {
      return null;
    }

    blog.name = blogDto.name;
    blog.description = blogDto.description;
    blog.websiteUrl = blogDto.websiteUrl;

    return blog;
  },

  async deleteBlog(blogId: string): Promise<boolean> {
    const blogIndex = db.blogs.findIndex((b) => b.id === blogId);

    if (blogIndex === -1) {
      return false;
    }

    db.blogs.splice(blogIndex, 1);

    return true;
  },
};
