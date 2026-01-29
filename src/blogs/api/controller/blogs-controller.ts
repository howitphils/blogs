import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-status-types";
import {
  RequestWithParamsId,
  RequestWithBody,
  RequestWithParamsIdAndBody,
  RequestWithQuery,
  RequestWithParamsIdAndQuery,
} from "../../../core/types/request-types";
import { blogsQueryRepository } from "../../repository/blogs-query-repository";
import {
  BlogViewModel,
  BlogInputModel,
  BlogQueryParams,
} from "../../types/blogs-types";
import { blogsService } from "../../application/blogs-service";
import { PaginationType } from "../../../core/types/pagination-types";
import { matchedData } from "express-validator";
import {
  PostForBlogInputModel,
  PostViewModel,
} from "../../../posts/types/posts-types";
import { BaseQueryParams } from "../../../core/types/query-params-types";
import { postsQueryRepository } from "../../../posts/repository/posts-query-repository";
import { postsService } from "../../../posts/application/posts-service";

export const blogsController = {
  getAllBlogs: async (
    req: RequestWithQuery<BlogQueryParams>,
    res: Response<PaginationType<BlogViewModel>>,
  ) => {
    const sortParams = matchedData<BlogQueryParams>(req);

    const blogs = await blogsQueryRepository.getBlogs(sortParams);

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

  getPostsForBlog: async (
    req: RequestWithParamsIdAndQuery<BaseQueryParams>,
    res: Response<PaginationType<PostViewModel>>,
  ) => {
    const blogId = req.params.id;
    const queryParams = matchedData<BaseQueryParams>(req);

    const posts = await postsQueryRepository.getPosts(queryParams, blogId);

    if (!posts) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }

    res.status(HttpStatus.OK).json(posts);

    return;
  },

  createPostForBlog: async (
    req: RequestWithParamsIdAndBody<PostForBlogInputModel>,
    res: Response<PostViewModel>,
  ) => {
    const blogId = req.params.id;
    const { content, shortDescription, title } = req.body;

    const newPostId = await postsService.createPost({
      blogId,
      content,
      shortDescription,
      title,
    });

    if (!newPostId) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }

    const newPost = await postsQueryRepository.getPostById(newPostId);

    if (!newPost) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }

    res.status(HttpStatus.CREATED).json(newPost);
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
