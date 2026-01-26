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

    res.status(HttpStatus.OK).json(posts);

    return;
  },

  getPostById: async (
    req: RequestWithParamsId,
    res: Response<PostViewModel>,
  ) => {
    const postId = req.params.id;
    const post = await postsQueryRepository.getPostById(postId);

    if (!post) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.status(HttpStatus.OK).json(post);
    }

    return;
  },

  createPost: async (
    req: RequestWithBody<PostInputModel>,
    res: Response<PostViewModel>,
  ) => {
    const dto = req.body;

    const newPostId = await postsService.createPost(dto);

    if (!newPostId) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }

    const newPost = await postsQueryRepository.getPostById(newPostId);

    if (!newPost) {
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }

    res.status(HttpStatus.CREATED).json(newPost);
    return;
  },

  updatePost: async (
    req: RequestWithParamsIdAndBody<PostInputModel>,
    res: Response,
  ) => {
    const postId = req.params.id;
    const dto = req.body;

    const isUpdated = await postsService.updatePost({
      id: postId,
      ...dto,
    });

    if (!isUpdated) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return;
  },

  deletePost: async (req: RequestWithParamsId, res: Response) => {
    const postId = req.params.id;

    const isDeleted = await postsService.deletePost(postId);

    if (!isDeleted) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return;
  },
};
