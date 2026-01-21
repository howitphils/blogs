import { Request, Response } from "express";
import {
  RequestWithBody,
  RequestWithParamsId,
  RequestWithParamsIdAndBody,
} from "../../request-types";
import { BlogInputModel } from "../types/blogs-types";

export const blogsController = {
  getAllBlogs: async (req: Request, res: Response) => {
    // Implementation here
    res.send("Get all blogs");
  },

  getBlogById: async (req: RequestWithParamsId, res: Response) => {
    // Implementation here
  },

  createBlog: async (req: RequestWithBody<BlogInputModel>, res: Response) => {
    // Implementation here
  },

  updateBlog: async (
    req: RequestWithParamsIdAndBody<BlogInputModel>,
    res: Response,
  ) => {
    // Implementation here
  },

  deleteBlog: async (req: RequestWithParamsId, res: Response) => {
    // Implementation here
  },
};
