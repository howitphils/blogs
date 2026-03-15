import { CommentDbDocument, CommentDbModel } from "../types/comments-types";
import { CommentNotFoundError } from "../application/errors/comments-errors";
import { injectable } from "inversify";
import { CommentModel } from "./schemas/comment-schema";

@injectable()
export class CommentsRepository {
  async createComment(dto: CommentDbModel): Promise<string> {
    const comment = await CommentModel.insertOne(dto);

    return comment.id;
  }

  async getByIdOrFail(id: string): Promise<CommentDbDocument> {
    return CommentModel.findById(id).orFail(new CommentNotFoundError());
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

  async updateLikesCount(
    commentId: string,
    likesCount: number,
    dislikesCount: number,
  ) {
    await CommentModel.findByIdAndUpdate(commentId, {
      likesCount,
      dislikesCount,
    });
  }
}
