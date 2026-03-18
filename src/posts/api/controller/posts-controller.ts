import { PostsQueryRepository } from "./../../repository/posts-query-repository";
import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import {
  RequestWithParamsId,
  RequestWithBody,
  RequestWithParamsIdAndBody,
  RequestWithQuery,
} from "../../../core/types/request-types";
import { PostViewModel, PostInputModel } from "../../types/posts-types";
import { BaseQueryParams } from "../../../core/types/query-params-types";
import { matchedData } from "express-validator";
import { PaginationType } from "../../../core/types/pagination-types";
import { inject, injectable } from "inversify";
import { PostsService } from "../../application/posts-service";
import { UpdateLikeStatusInputModel } from "../../../comments/types/comments-types";

@injectable()
export class PostsController {
  constructor(
    @inject(PostsService)
    private postsService: PostsService,

    @inject(PostsQueryRepository)
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  async getAllPosts(
    req: RequestWithQuery<BaseQueryParams>,
    res: Response<PaginationType<PostViewModel>>,
  ): Promise<Response> {
    const sortParams = matchedData<BaseQueryParams>(req);

    const posts = await this.postsQueryRepository.getPosts(sortParams);

    return res.status(HttpStatus.OK).json(posts);
  }

  async getPostById(
    req: RequestWithParamsId,
    res: Response<PostViewModel>,
  ): Promise<Response> {
    const postId = req.params.id;
    const post = await this.postsQueryRepository.getPostByIdOrFail(postId);

    return res.status(HttpStatus.OK).json(post);
  }

  async createPost(
    req: RequestWithBody<PostInputModel>,
    res: Response<PostViewModel>,
  ): Promise<Response> {
    const dto = req.body;

    const newPostId = await this.postsService.createPost(dto);

    const newPost =
      await this.postsQueryRepository.getPostByIdOrFail(newPostId);

    return res.status(HttpStatus.CREATED).json(newPost);
  }

  async updatePost(
    req: RequestWithParamsIdAndBody<PostInputModel>,
    res: Response,
  ): Promise<Response> {
    const postId = req.params.id;
    const dto = req.body;

    await this.postsService.updatePost({
      id: postId,
      ...dto,
    });

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  async updatePostLikeStatus(
    req: RequestWithParamsIdAndBody<UpdateLikeStatusInputModel>,
    res: Response,
  ): Promise<Response> {
    const userId = req.user.userId;
    const postId = req.params.id;

    await this.postsService.updatePostLikeStatus({
      postId,
      userId,
      status: req.body.likeStatus,
    });

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  async deletePost(req: RequestWithParamsId, res: Response): Promise<Response> {
    const postId = req.params.id;

    await this.postsService.deletePost(postId);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
