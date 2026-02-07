import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-status-types";
import {
  RequestWithParamsId,
  RequestWithParamsIdAndBody,
  RequestWithParamsIdAndQuery,
} from "../../../core/types/request-types";
import {
  CommentViewModel,
  CommentInputModel,
  CreateCommentDto,
  UpdateCommentDto,
} from "../../types/comments-types";
import { BaseQueryParams } from "../../../core/types/query-params-types";
import { matchedData } from "express-validator";
import { PaginationType } from "../../../core/types/pagination-types";
import { commentsQueryRepository } from "../../repository/comments-query-repository";
import { commentsService } from "../../application/comments-service";

export const commentsController = {
  getAllComments: async (
    req: RequestWithParamsIdAndQuery<BaseQueryParams>,
    res: Response<PaginationType<CommentViewModel>>,
  ): Promise<Response> => {
    const postId = req.params.id;
    const sortParams = matchedData<BaseQueryParams>(req);

    const comments = await commentsQueryRepository.getComments(
      sortParams,
      postId,
    );

    return res.status(HttpStatus.OK).json(comments);
  },

  getCommentById: async (
    req: RequestWithParamsId,
    res: Response<CommentViewModel>,
  ): Promise<Response> => {
    const commentId = req.params.id;

    const comment =
      await commentsQueryRepository.getCommentByIdOrFail(commentId);

    return res.status(HttpStatus.OK).json(comment);
  },

  createComment: async (
    req: RequestWithParamsIdAndBody<CommentInputModel>,
    res: Response<CommentViewModel>,
  ): Promise<Response> => {
    const createCommentDto: CreateCommentDto = {
      content: req.body.content,
      postId: req.params.id,
      userId: req.user.userId,
    };

    const newCommentId = await commentsService.createComment(createCommentDto);

    const newComment =
      await commentsQueryRepository.getCreatedComment(newCommentId);

    return res.status(HttpStatus.CREATED).json(newComment);
  },

  updateComment: async (
    req: RequestWithParamsIdAndBody<CommentInputModel>,
    res: Response,
  ): Promise<Response> => {
    const updateCommendDto: UpdateCommentDto = {
      id: req.params.id,
      content: req.body.content,
      userId: req.user.userId,
    };

    await commentsService.updateComment(updateCommendDto);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  },

  deleteComment: async (
    req: RequestWithParamsId,
    res: Response,
  ): Promise<Response> => {
    const commentId = req.params.id;

    await commentsService.deleteComment(commentId, req.user.userId);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  },
};
