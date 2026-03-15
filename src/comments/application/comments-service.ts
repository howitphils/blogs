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
import { LikeStatuses } from "../../core/types/likes-types";

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
    const comment = await this.commentsRepository.getByIdOrFail(dto.id);

    if (comment.userId !== dto.userId) {
      throw new ForbiddenError("Forbidden action for this user");
    }

    await this.commentsRepository.update(dto.id, dto.content);
  }

  async updateLikeStatus(dto: UpdateLikeStatusDto): Promise<void> {
    const comment = await this.commentsRepository.getByIdOrFail(dto.commentId);

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

      if (dto.likeStatus === LikeStatuses.LIKE) {
        await this.commentsRepository.updateLikesCount(
          comment.id,
          comment.likesCount + 1,
          comment.dislikesCount,
        );
      } else if (dto.likeStatus === LikeStatuses.DISLIKE) {
        await this.commentsRepository.updateLikesCount(
          comment.id,
          comment.likesCount,
          comment.dislikesCount + 1,
        );
      }

      return;
    }

    if (like.status === dto.likeStatus) return;

    await this.commentLikesRepository.update(dto);

    // IF NONE
    if (dto.likeStatus === LikeStatuses.NONE) {
      if (like.status === LikeStatuses.LIKE) {
        await this.commentsRepository.updateLikesCount(
          comment.id,
          comment.likesCount - 1,
          comment.dislikesCount,
        );
      } else if (like.status === LikeStatuses.DISLIKE) {
        await this.commentsRepository.updateLikesCount(
          comment.id,
          comment.likesCount,
          comment.dislikesCount - 1,
        );
      }
    }

    //IF LIKED
    if (dto.likeStatus === LikeStatuses.LIKE) {
      if (like.status === LikeStatuses.NONE) {
        await this.commentsRepository.updateLikesCount(
          comment.id,
          comment.likesCount + 1,
          comment.dislikesCount,
        );
      } else if (like.status === LikeStatuses.DISLIKE) {
        await this.commentsRepository.updateLikesCount(
          comment.id,
          comment.likesCount + 1,
          comment.dislikesCount - 1,
        );
      }
    }

    //IF DISLIKED
    if (dto.likeStatus === LikeStatuses.DISLIKE) {
      if (like.status === LikeStatuses.NONE) {
        await this.commentsRepository.updateLikesCount(
          comment.id,
          comment.likesCount,
          comment.dislikesCount + 1,
        );
      } else if (like.status === LikeStatuses.LIKE) {
        await this.commentsRepository.updateLikesCount(
          comment.id,
          comment.likesCount - 1,
          comment.dislikesCount + 1,
        );
      }
    }
  }

  async deleteComment(id: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.getByIdOrFail(id);

    if (comment.userId !== userId) {
      throw new ForbiddenError("Forbidden action for this user");
    }

    await this.commentsRepository.delete(id);
  }
}
