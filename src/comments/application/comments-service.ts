import { postsRepository } from "../../posts/repository/posts-repository";
import { usersRepository } from "../../users/repository/users-repository";
import { commentsRepository } from "../repository/comments-repository";
import {
  CommentDbModel,
  CreateCommentDto,
  UpdateCommentDto,
} from "../types/comments-types";
import { CommentNotFoundError } from "./errors/comments-errors";

export const commentsService = {
  async createComment(dto: CreateCommentDto): Promise<string> {
    await postsRepository.getPostByIdOrFail(dto.postId);

    const user = await usersRepository.getUserByIdOrFail(dto.userId);

    const newComment: CommentDbModel = {
      content: dto.content,
      postId: dto.postId,
      userId: dto.userId,
      userLogin: user.login,
      createdAt: new Date().toISOString(),
    };

    return commentsRepository.createComment(newComment);
  },

  //TODO: 403 check
  async updateComment(dto: UpdateCommentDto): Promise<void> {
    const updateResult = await commentsRepository.updateComment(dto);

    if (!updateResult) {
      throw new CommentNotFoundError();
    }
  },

  async deleteComment(id: string): Promise<void> {
    const deleteResult = await commentsRepository.deleteComment(id);

    if (!deleteResult) {
      throw new CommentNotFoundError();
    }
  },
};
