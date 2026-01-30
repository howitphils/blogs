import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-status-types";
import {
  RequestWithParamsId,
  RequestWithBody,
  RequestWithParamsIdAndBody,
  RequestWithQuery,
} from "../../../core/types/request-types";
import { postsQueryRepository } from "../../repository/posts-query-repository";
import { PostViewModel, PostInputModel } from "../../types/posts-types";
import { postsService } from "../../application/posts-service";
import { BaseQueryParams } from "../../../core/types/query-params-types";
import { matchedData } from "express-validator";
import { PaginationType } from "../../../core/types/pagination-types";

export const postsController = {
  getAllPosts: async (
    req: RequestWithQuery<BaseQueryParams>,
    res: Response<PaginationType<PostViewModel>>,
  ) => {
    const sortParams = matchedData<BaseQueryParams>(req);

    const posts = await postsQueryRepository.getPosts(sortParams);

    return res.status(HttpStatus.OK).json(posts);
  },

  getPostById: async (
    req: RequestWithParamsId,
    res: Response<PostViewModel>,
  ) => {
    const postId = req.params.id;
    const post = await postsQueryRepository.getPostByIdOrFail(postId);

    return res.status(HttpStatus.OK).json(post);
  },

  createPost: async (
    req: RequestWithBody<PostInputModel>,
    res: Response<PostViewModel>,
  ) => {
    const dto = req.body;

    const newPostId = await postsService.createPost(dto);

    const newPost = await postsQueryRepository.getCreatedPost(newPostId);

    return res.status(HttpStatus.CREATED).json(newPost);
  },

  updatePost: async (
    req: RequestWithParamsIdAndBody<PostInputModel>,
    res: Response,
  ) => {
    const postId = req.params.id;
    const dto = req.body;

    await postsService.updatePost({
      id: postId,
      ...dto,
    });

    return res.sendStatus(HttpStatus.NO_CONTENT);
  },

  deletePost: async (req: RequestWithParamsId, res: Response) => {
    const postId = req.params.id;

    await postsService.deletePost(postId);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  },
};
