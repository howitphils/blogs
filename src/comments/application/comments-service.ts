import { CommentsRepository } from "./../repository/comments-repository";
import { UsersRepository } from "./../../users/repository/users-repository";
import { inject, injectable } from "inversify";
import { ForbiddenError } from "../../core/middlewares/error-handling/custom-errors/forbidden-error";
import {
  CommentDbModel,
  CommentLikeDbModel,
  CreateCommentDto,
  UpdateCommentDto,
  UpdateLikeStatusDto,
} from "../types/comments-types";
import { PostsRepository } from "../../posts/repository/posts-repository";
import { CommentLikesRepository } from "../repository/comment-like-repository";

@injectable()
export class CommentsService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(CommentsRepository) private commentsRepository: CommentsRepository,
    @inject(CommentLikesRepository)
    private commentLikesRepository: CommentLikesRepository,
    @inject(PostsRepository) private postsRepository: PostsRepository,
  ) {}

  async createComment(dto: CreateCommentDto): Promise<string> {
    await this.postsRepository.getPostByIdOrFail(dto.postId);

    const user = await this.usersRepository.getUserByIdOrFail(dto.userId);

    const newComment: CommentDbModel = {
      content: dto.content,
      postId: dto.postId,
      userId: dto.userId,
      userLogin: user.accountData.login,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      dislikesCount: 0,
    };

    return this.commentsRepository.createComment(newComment);
  }

  async updateComment(dto: UpdateCommentDto): Promise<void> {
    const comment = await this.commentsRepository.getCommentByIdOrFail(dto.id);

    if (comment.userId !== dto.userId) {
      throw new ForbiddenError("Forbidden action for this user");
    }

    await this.commentsRepository.update(dto.id, dto.content);
  }

  async updateLikeStatus(dto: UpdateLikeStatusDto): Promise<void> {
    const comment = await this.commentsRepository.getCommentByIdOrFail(
      dto.commentId,
    );

    const like = await this.commentLikesRepository.get(
      dto.userId,
      dto.commentId,
    );

    if (!like) {
      const newLike: CommentLikeDbModel = {
        status: dto.likeStatus,
        commentId: dto.commentId,
        userId: dto.userId,
      };

      await this.commentLikesRepository.create(newLike);
    }

    await this.commentLikesRepository.update(dto);

    // await this.commentsRepository.update(dto.id, dto.content);
  }

  async deleteComment(id: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.getCommentByIdOrFail(id);

    if (comment.userId !== userId) {
      throw new ForbiddenError("Forbidden action for this user");
    }

    await this.commentsRepository.delete(id);
  }
}
