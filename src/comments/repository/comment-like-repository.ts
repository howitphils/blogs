import {
  CommentLikeDbDocument,
  CommentLikeDbModel,
  UpdateLikeStatusDto,
} from "../types/comments-types";
import { injectable } from "inversify";
import { CommentLikeModel } from "./schemas/like-schema";
import { CommentLikeNotFoundError } from "../application/errors/comments-errors";

@injectable()
export class CommentLikesRepository {
  async create(dto: CommentLikeDbModel): Promise<void> {
    await CommentLikeModel.insertOne(dto);
  }

  async getLikeOrFail(
    userId: string,
    commentId: string,
  ): Promise<CommentLikeDbDocument | null> {
    return CommentLikeModel.findOne({ commentId, userId });
  }

  async update(dto: UpdateLikeStatusDto): Promise<CommentLikeDbModel> {
    const { commentId, likeStatus, userId } = dto;
    return CommentLikeModel.findOneAndUpdate(
      { userId, commentId },
      {
        status: likeStatus,
      },
    ).orFail(new CommentLikeNotFoundError());
  }
}
