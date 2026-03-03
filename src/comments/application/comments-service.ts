import { CommentsRepository } from "./../repository/comments-repository";
import { UsersRepository } from "./../../users/repository/users-repository";
import { inject, injectable } from "inversify";
import { ForbiddenError } from "../../core/middlewares/error-handling/custom-errors/forbidden-error";
import { ServerError } from "../../core/middlewares/error-handling/custom-errors/server-error";
import { postsRepository } from "../../posts/repository/posts-repository";
import {
  CommentDbModel,
  CreateCommentDto,
  UpdateCommentDto,
} from "../types/comments-types";

@injectable()
export class CommentsService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(CommentsRepository) private commentsRepository: CommentsRepository,
  ) {}

  async createComment(dto: CreateCommentDto): Promise<string> {
    await postsRepository.getPostByIdOrFail(dto.postId);

    const user = await this.usersRepository.getUserByIdOrFail(dto.userId);

    const newComment: CommentDbModel = {
      content: dto.content,
      postId: dto.postId,
      userId: dto.userId,
      userLogin: user.accountData.login,
      createdAt: new Date().toISOString(),
    };

    return this.commentsRepository.createComment(newComment);
  }

  async updateComment(dto: UpdateCommentDto): Promise<void> {
    const comment = await this.commentsRepository.getCommentByIdOrFail(dto.id);

    if (comment.userId !== dto.userId) {
      throw new ForbiddenError("Forbidden action for this user");
    }

    const updateResult = await this.commentsRepository.updateComment(dto);

    if (!updateResult) {
      throw new ServerError("Comment was not updated");
    }
  }

  async deleteComment(id: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.getCommentByIdOrFail(id);

    if (comment.userId !== userId) {
      throw new ForbiddenError("Forbidden action for this user");
    }

    const deleteResult = await this.commentsRepository.deleteComment(id);

    if (!deleteResult) {
      throw new ServerError("Comment was not deleted");
    }
  }
}
