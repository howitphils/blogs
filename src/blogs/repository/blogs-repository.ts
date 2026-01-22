import { db } from "../../db/db";
import { BlogInputModel, BlogViewModel } from "../types/blogs-types";

export const blogsRepository = {
  async getAllBlogs(): Promise<BlogViewModel[]> {
    return db.blogs;
  },

  async getBlogById(blogId: string): Promise<BlogViewModel | null> {
    return db.blogs.find((b) => b.id === blogId) || null;
  },

  async createBlog(blogDto: BlogInputModel): Promise<BlogViewModel> {
    const newBlog: BlogViewModel = {
      id: (db.blogs.length + 1).toString(),
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
    };

    db.blogs.unshift(newBlog);
    return newBlog;
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
