import { CommentsQueryRepository } from "./../../repository/comments-query-repository";
import { CommentsService } from "./../../application/comments-service";
import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
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
  UpdateLikeStatusInputModel,
  UpdateLikeStatusDto,
} from "../../types/comments-types";
import { BaseQueryParams } from "../../../core/types/query-params-types";
import { matchedData } from "express-validator";
import { PaginationType } from "../../../core/types/pagination-types";
import { inject, injectable } from "inversify";

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentsService)
    private commentsService: CommentsService,

    @inject(CommentsQueryRepository)
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async getAllComments(
    req: RequestWithParamsIdAndQuery<BaseQueryParams>,
    res: Response<PaginationType<CommentViewModel>>,
  ): Promise<Response> {
    const postId = req.params.id;
    const sortParams = matchedData<BaseQueryParams>(req);

    const comments = await this.commentsQueryRepository.getComments(
      sortParams,
      postId,
    );

    return res.status(HttpStatus.OK).json(comments);
  }

  async getCommentById(
    req: RequestWithParamsId,
    res: Response<CommentViewModel>,
  ): Promise<Response> {
    const commentId = req.params.id;

    const comment =
      await this.commentsQueryRepository.getCommentByIdOrFail(commentId);

    return res.status(HttpStatus.OK).json(comment);
  }

  async createComment(
    req: RequestWithParamsIdAndBody<CommentInputModel>,
    res: Response<CommentViewModel>,
  ): Promise<Response> {
    const createCommentDto: CreateCommentDto = {
      content: req.body.content,
      postId: req.params.id,
      userId: req.user.userId,
    };

    const newCommentId =
      await this.commentsService.createComment(createCommentDto);

    const newComment =
      await this.commentsQueryRepository.getCommentByIdOrFail(newCommentId);

    return res.status(HttpStatus.CREATED).json(newComment);
  }

  async updateComment(
    req: RequestWithParamsIdAndBody<CommentInputModel>,
    res: Response,
  ): Promise<Response> {
    const updateCommendDto: UpdateCommentDto = {
      id: req.params.id,
      content: req.body.content,
      userId: req.user.userId,
    };

    await this.commentsService.updateComment(updateCommendDto);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  async updateLikeStatus(
    req: RequestWithParamsIdAndBody<UpdateLikeStatusInputModel>,
    res: Response,
  ): Promise<Response> {
    const updateLikeStatusDto: UpdateLikeStatusDto = {
      userId: req.user.userId,
      commentId: req.params.id,
      likeStatus: req.body.likeStatus,
    };

    await this.commentsService.updateLikeStatus(updateLikeStatusDto);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }

  async deleteComment(
    req: RequestWithParamsId,
    res: Response,
  ): Promise<Response> {
    const commentId = req.params.id;

    await this.commentsService.deleteComment(commentId, req.user.userId);

    return res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
