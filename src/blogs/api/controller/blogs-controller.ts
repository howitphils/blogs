import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-status-types";
import {
  RequestWithParamsId,
  RequestWithBody,
  RequestWithParamsIdAndBody,
} from "../../../core/types/request-types";
import { blogsQueryRepository } from "../../repository/blogs-query-repository";
import { BlogViewModel, BlogInputModel } from "../../types/blogs-types";
import { blogsService } from "../../application/blogs-service";

export const blogsController = {
  getAllBlogs: async (req: Request, res: Response<BlogViewModel[]>) => {
    const blogs = await blogsQueryRepository.getBlogs();

    res.status(HttpStatus.OK).json(blogs);
    return;
  },

  getBlogById: async (
    req: RequestWithParamsId,
    res: Response<BlogViewModel>,
  ) => {
    const blogId = req.params.id;
    const blog = await blogsQueryRepository.getBlogById(blogId);

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
    const newBlogId = await blogsService.createBlog(req.body);

    const newBlog = await blogsQueryRepository.getBlogById(newBlogId);

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
    const blogDto = { ...req.body, blogId };

    const updateResult = await blogsService.updateBlog(blogDto);

    if (!updateResult) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return;
  },

  deleteBlog: async (req: RequestWithParamsId, res: Response) => {
    const blogId = req.params.id;

    const isDeleted = await blogsService.deleteBlog(blogId);

    if (!isDeleted) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return;
  },
};
