import { Request, Response } from "express";
import {
  RequestWithBody,
  RequestWithParamsId,
  RequestWithParamsIdAndBody,
} from "../../core/types/request-types";
import { BlogInputModel, BlogViewModel } from "../types/blogs-types";
import { HttpStatus } from "../../core/types/http-status-types";
import { blogsRepository } from "../repository/blogs-repository";

export const blogsController = {
  getAllBlogs: async (req: Request, res: Response) => {
    const blogs = await blogsRepository.getAllBlogs();

    res.status(HttpStatus.OK).json(blogs);
    return;
  },

  getBlogById: async (req: RequestWithParamsId, res: Response) => {
    const blogId = req.params.id;
    const blog = await blogsRepository.getBlogById(blogId);

    if (!blog) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.status(HttpStatus.OK).json(blog);
    }

    return;
  },

  createBlog: async (
    req: RequestWithBody<BlogInputModel>,
    res: Response<BlogViewModel>,
  ) => {
    const newBlogId = await blogsRepository.createBlog(req.body);

    const newBlog = await blogsRepository.getBlogById(newBlogId);

    if (!newBlog) {
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }

    res.status(HttpStatus.CREATED).json(newBlog);

    return;
  },

  updateBlog: async (
    req: RequestWithParamsIdAndBody<BlogInputModel>,
    res: Response,
  ) => {
    const blogId = req.params.id;

    const blog = await blogsRepository.updateBlog(blogId, req.body);

    if (!blog) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return;
  },

  deleteBlog: async (req: RequestWithParamsId, res: Response) => {
    const blogId = req.params.id;

    const isDeleted = await blogsRepository.deleteBlog(blogId);

    if (!isDeleted) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return;
  },
};
