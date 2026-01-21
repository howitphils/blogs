import { db } from "../../db/db";
import { BlogInputModel, BlogViewModel } from "../types/blogs-types";

export const blogsRepository = {
  getAllBlogs: async (): Promise<BlogViewModel[]> => {
    return db.blogs;
  },

  getBlogById: async (blogId: string): Promise<BlogViewModel | null> => {
    return db.blogs.find((b) => b.id === blogId) || null;
  },

  createBlog: async (blogDto: BlogInputModel): Promise<BlogViewModel> => {
    const newBlog: BlogViewModel = {
      id: (db.blogs.length + 1).toString(),
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
    };

    db.blogs.unshift(newBlog);
    return newBlog;
  },

  updateBlog: async (
    blogId: string,
    blogDto: BlogInputModel,
  ): Promise<BlogViewModel | null> => {
    const blog = db.blogs.find((b) => b.id === blogId);

    if (!blog) {
      return null;
    }

    blog.name = blogDto.name;
    blog.description = blogDto.description;
    blog.websiteUrl = blogDto.websiteUrl;

    return blog;
  },

  deleteBlog: async (blogId: string): Promise<boolean> => {
    const blogIndex = db.blogs.findIndex((b) => b.id === blogId);

    if (blogIndex === -1) {
      return false;
    }

    db.blogs.splice(blogIndex, 1);

    return true;
  },
};
