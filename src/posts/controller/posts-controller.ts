import { Request, Response } from "express";
import { BlogInputModel } from "../../blogs/types/blogs-types";
import {
  RequestWithBody,
  RequestWithParamsId,
  RequestWithParamsIdAndBody,
} from "../../common-types/request-types";

export const postsController = {
  getAllPosts: async (req: Request, res: Response) => {
    // Implementation here
  },

  getPostById: async (req: RequestWithParamsId, res: Response) => {
    // Implementation here
  },
  createPost: async (req: RequestWithBody<BlogInputModel>, res: Response) => {
    // Implementation here
  },

  updatePost: async (
    req: RequestWithParamsIdAndBody<BlogInputModel>,
    res: Response,
  ) => {
    // Implementation here
  },

  deletePost: async (req: RequestWithParamsId, res: Response) => {
    // Implementation here
  },
};
