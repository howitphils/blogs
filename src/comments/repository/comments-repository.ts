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

  async getCommentByIdOrFail(id: string): Promise<CommentDbDocument> {
    return CommentModel.findById(id).orFail(new CommentNotFoundError());
  }

  async updateComment(id: string, content: string): Promise<CommentDbDocument> {
    return CommentModel.findByIdAndUpdate(id, {
      content,
    }).orFail(new CommentNotFoundError());
  }

  async deleteComment(id: string): Promise<CommentDbDocument> {
    return CommentModel.findByIdAndDelete(id).orFail(
      new CommentNotFoundError(),
    );
  }
}
