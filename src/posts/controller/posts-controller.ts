import { Request, Response } from "express";
import {
  RequestWithBody,
  RequestWithParamsId,
  RequestWithParamsIdAndBody,
} from "../../core/types/request-types";
import { HttpStatus } from "../../core/types/http-status-types";
import { postsRepository } from "../repository/posts-repository";
import { PostInputModel } from "../types/posts-types";

export const postsController = {
  getAllPosts: async (req: Request, res: Response) => {
    const posts = await postsRepository.getAllPosts();

    res.status(HttpStatus.OK).json(posts);

    return;
  },

  getPostById: async (req: RequestWithParamsId, res: Response) => {
    const postId = req.params.id;
    const post = await postsRepository.getPostById(postId);

    if (!post) {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.status(HttpStatus.OK).json(post);
    }

    return;
  },
  createPost: async (req: RequestWithBody<PostInputModel>, res: Response) => {
    const dto = req.body;

    const newPost = await postsRepository.createPost(dto);

    if (!newPost) {
      res.sendStatus(HttpStatus.BAD_REQUEST);
    } else {
      res.status(HttpStatus.CREATED).json(newPost);
    }

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
