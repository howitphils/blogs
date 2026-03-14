import {
  CommentDbDocument,
  CommentDbModel,
  CommentLikeDbDocument,
} from "../types/comments-types";
import {
  CommentLikeNotFoundError,
  CommentNotFoundError,
} from "../application/errors/comments-errors";
import { injectable } from "inversify";
import { CommentModel } from "./schemas/comment-schema";
import { CommentLikeModel } from "./schemas/like-schema";

@injectable()
export class CommentsRepository {
  async createComment(dto: CommentDbModel): Promise<string> {
    const comment = await CommentModel.insertOne(dto);

    return comment.id;
  }

  async getCommentByIdOrFail(id: string): Promise<CommentDbDocument> {
    return CommentModel.findById(id).orFail(new CommentNotFoundError());
  }

  async getLikeOrFail(
    userId: string,
    commentId: string,
  ): Promise<CommentLikeDbDocument> {
    return CommentLikeModel.findOne({ commentId, userId }).orFail(
      new CommentLikeNotFoundError(),
    );
  }

  async update(id: string, content: string): Promise<CommentDbDocument> {
    return CommentModel.findByIdAndUpdate(id, {
      content,
    }).orFail(new CommentNotFoundError());
  }

  async delete(id: string): Promise<CommentDbDocument> {
    return CommentModel.findByIdAndDelete(id).orFail(
      new CommentNotFoundError(),
    );
  }
}
