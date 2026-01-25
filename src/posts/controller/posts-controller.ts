import { Request, Response } from "express";
import {
  RequestWithBody,
  RequestWithParamsId,
  RequestWithParamsIdAndBody,
} from "../../core/types/request-types";
import { HttpStatus } from "../../core/types/http-status-types";
import { postsRepository } from "../repository/posts-repository";
import { PostInputModel, PostViewModel } from "../types/posts-types";
import { postsQueryRepository } from "../repository/posts-query-repository";

export const postsController = {
  getAllPosts: async (req: Request, res: Response<PostViewModel[]>) => {
    const posts = await postsQueryRepository.getPosts();

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

    const newPostId = await postsRepository.createPost(dto);

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

    const isUpdated = await postsRepository.updatePost({
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

    const isDeleted = await postsRepository.deletePost(postId);

    if (!isDeleted) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }

    return;
  },
};
