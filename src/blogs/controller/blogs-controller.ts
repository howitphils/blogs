import { Request, Response } from "express";
import {
  RequestWithBody,
  RequestWithParamsId,
  RequestWithParamsIdAndBody,
} from "../../request-types";
import { BlogInputModel } from "../types/blogs-types";
import { HttpStatus } from "../../types";
import { db } from "../../db/db";

export const blogsController = {
  getAllBlogs: async (req: Request, res: Response) => {
    res.status(HttpStatus.OK).json(db.blogs);
    return;
  },

  getBlogById: async (req: RequestWithParamsId, res: Response) => {
    const blogId = req.params.id;
    const blog = db.blogs.find((b) => b.id === blogId);

    if (!blog) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }

    res
      .status(HttpStatus.OK)
      .json(db.blogs.find((blog) => blog.id === req.params.id));

    return;
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
