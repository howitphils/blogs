import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import {
  RequestWithParamsId,
  RequestWithBody,
  RequestWithParamsIdAndBody,
  RequestWithQuery,
  RequestWithParamsIdAndQuery,
} from "../../../core/types/request-types";
import {
  BlogViewModel,
  BlogInputModel,
  BlogQueryParams,
  UpdateBlogDtoModel,
} from "../../types/blogs-types";
import { PaginationType } from "../../../core/types/pagination-types";
import { matchedData } from "express-validator";
import {
  PostForBlogInputModel,
  PostViewModel,
} from "../../../posts/types/posts-types";
import { BaseQueryParams } from "../../../core/types/query-params-types";
import { BlogsService } from "../../application/blogs-service";
import { inject, injectable } from "inversify";
import { BlogsQueryRepository } from "../../repository/blogs-query-repository";
import { PostsQueryRepository } from "../../../posts/repository/posts-query-repository";
import { PostsService } from "../../../posts/application/posts-service";

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsService)
    private blogsService: BlogsService,

    @inject(BlogsQueryRepository)
    private blogsQueryRepository: BlogsQueryRepository,

    @inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,

    @inject(PostsService)
    private postsService: PostsService,
  ) {}

  async getAllBlogs(
    req: RequestWithQuery<BlogQueryParams>,
    res: Response<PaginationType<BlogViewModel>>,
  ): Promise<Response> {
    const sortParams = matchedData<BlogQueryParams>(req);

    const blogs = await this.blogsQueryRepository.getBlogs(sortParams);

    return res.status(HttpStatus.OK).json(blogs);
  }

  async getBlogById(
    req: RequestWithParamsId,
    res: Response<BlogViewModel>,
  ): Promise<Response> {
    const blogId = req.params.id;

    const blog = await this.blogsQueryRepository.getBlogByIdOrFail(blogId);

    return res.status(HttpStatus.OK).json(blog);
  }

  async getPostsForBlog(
    req: RequestWithParamsIdAndQuery<BaseQueryParams>,
    res: Response<PaginationType<PostViewModel>>,
  ): Promise<Response> {
    const blogId = req.params.id;
    const sortParams = matchedData<BaseQueryParams>(req);

    const posts = await this.postsQueryRepository.getPosts(sortParams, blogId);

    return res.status(HttpStatus.OK).json(posts);
  }

  async createPostForBlog(
    req: RequestWithParamsIdAndBody<PostForBlogInputModel>,
    res: Response<PostViewModel>,
  ): Promise<Response> {
    const blogId = req.params.id;
    const { content, shortDescription, title } = req.body;

    const newPostId = await this.postsService.createPost({
      blogId,
      content,
      shortDescription,
      title,
    });

    const newPost =
      await this.postsQueryRepository.getPostByIdOrFail(newPostId);

    return res.status(HttpStatus.CREATED).json(newPost);
  }

  async createBlog(
    req: RequestWithBody<BlogInputModel>,
    res: Response<BlogViewModel>,
  ): Promise<Response> {
    const newBlogId = await this.blogsService.createBlog(req.body);

    const newBlog =
      await this.blogsQueryRepository.getBlogByIdOrFail(newBlogId);

    return res.status(HttpStatus.CREATED).json(newBlog);
  }

  async updateBlog(
    req: RequestWithParamsIdAndBody<BlogInputModel>,
    res: Response,
  ): Promise<Response> {
    const blogId = req.params.id;
    const blogDto: UpdateBlogDtoModel = { ...req.body, blogId };

    await this.blogsService.updateBlog(blogDto);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  async deleteBlog(req: RequestWithParamsId, res: Response): Promise<Response> {
    const blogId = req.params.id;

    await this.blogsService.deleteBlog(blogId);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
