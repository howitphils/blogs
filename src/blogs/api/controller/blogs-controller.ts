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
  UpdateBlogDtoModel,
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
  ): Promise<Response> => {
    const sortParams = matchedData<BlogQueryParams>(req);

    const blogs = await blogsQueryRepository.getBlogs(sortParams);

    return res.status(HttpStatus.OK).json(blogs);
  },

  getBlogById: async (
    req: RequestWithParamsId,
    res: Response<BlogViewModel>,
  ): Promise<Response> => {
    const blogId = req.params.id;

    const blog = await blogsQueryRepository.getBlogByIdOrFail(blogId);

    return res.status(HttpStatus.OK).json(blog);
  },

  getPostsForBlog: async (
    req: RequestWithParamsIdAndQuery<BaseQueryParams>,
    res: Response<PaginationType<PostViewModel>>,
  ): Promise<Response> => {
    const blogId = req.params.id;
    const queryParams = matchedData<BaseQueryParams>(req);

    const posts = await postsQueryRepository.getPosts(queryParams, blogId);

    return res.status(HttpStatus.OK).json(posts);
  },

  createPostForBlog: async (
    req: RequestWithParamsIdAndBody<PostForBlogInputModel>,
    res: Response<PostViewModel>,
  ): Promise<Response> => {
    const blogId = req.params.id;
    const { content, shortDescription, title } = req.body;

    const newPostId = await postsService.createPost({
      blogId,
      content,
      shortDescription,
      title,
    });

    const newPost = await postsQueryRepository.getPostByIdOrFail(newPostId);

    return res.status(HttpStatus.CREATED).json(newPost);
  },

  createBlog: async (
    req: RequestWithBody<BlogInputModel>,
    res: Response<BlogViewModel>,
  ): Promise<Response> => {
    const newBlogId = await blogsService.createBlog(req.body);

    const newBlog = await blogsQueryRepository.getCreatedBlogOrFail(newBlogId);

    return res.status(HttpStatus.CREATED).json(newBlog);
  },

  updateBlog: async (
    req: RequestWithParamsIdAndBody<BlogInputModel>,
    res: Response,
  ): Promise<Response> => {
    const blogId = req.params.id;
    const blogDto: UpdateBlogDtoModel = { ...req.body, blogId };

    await blogsService.updateBlog(blogDto);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  },

  deleteBlog: async (
    req: RequestWithParamsId,
    res: Response,
  ): Promise<Response> => {
    const blogId = req.params.id;

    await blogsService.deleteBlog(blogId);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  },
};
