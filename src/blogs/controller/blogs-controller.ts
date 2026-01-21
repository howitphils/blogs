import { Request, Response } from "express";
import {
  RequestWithBody,
  RequestWithParamsId,
  RequestWithParamsIdAndBody,
} from "../../common-types/request-types";
import { BlogInputModel, BlogViewModel } from "../types/blogs-types";
import { db } from "../../db/db";
import { HttpStatus } from "../../common-types/http-status-types";

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
    } else {
      res.status(HttpStatus.OK).json(blog);
    }

    return;
  },

  createBlog: async (req: RequestWithBody<BlogInputModel>, res: Response) => {
    const newBlog: BlogViewModel = {
      id: (db.blogs.length + 1).toString(),
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    };

    db.blogs.unshift(newBlog);

    res.status(HttpStatus.CREATED).json(newBlog);

    return;
  },

  updateBlog: async (
    req: RequestWithParamsIdAndBody<BlogInputModel>,
    res: Response,
  ) => {
    const blogId = req.params.id;
    const blog = db.blogs.find((b) => b.id === blogId);

    if (!blog) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }

    blog.name = req.body.name;
    blog.description = req.body.description;
    blog.websiteUrl = req.body.websiteUrl;

    res.sendStatus(HttpStatus.NO_CONTENT);
    return;
  },

  deleteBlog: async (req: RequestWithParamsId, res: Response) => {
    const blogId = req.params.id;
    const blogIndex = db.blogs.findIndex((b) => b.id === blogId);

    if (blogIndex === -1) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }

    db.blogs.splice(blogIndex, 1);

    res.sendStatus(HttpStatus.NO_CONTENT);
    return;
  },
};
