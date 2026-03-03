import { ObjectId, WithId } from "mongodb";
import { CommentDbModel, UpdateCommentDto } from "../types/comments-types";
import { commentsCollection } from "../../db/mongodb";
import { CommentNotFoundError } from "../application/errors/comments-errors";
import { injectable } from "inversify";

@injectable()
export class CommentsRepository {
  async createComment(dto: CommentDbModel): Promise<string> {
    const { insertedId } = await commentsCollection.insertOne(dto);

    return insertedId.toString();
  }

  async getCommentByIdOrFail(
    CommentId: string,
  ): Promise<WithId<CommentDbModel>> {
    const comment = await commentsCollection.findOne({
      _id: new ObjectId(CommentId),
    });

    if (!comment) {
      throw new CommentNotFoundError();
    }

    return comment;
  }

  async updateComment(dto: UpdateCommentDto): Promise<boolean> {
    const updateResult = await commentsCollection.updateOne(
      { _id: new ObjectId(dto.id) },
      {
        $set: {
          content: dto.content,
        },
      },
    );

    return updateResult.matchedCount !== 0;
  }

  async deleteComment(CommentId: string): Promise<boolean> {
    const deleteResult = await commentsCollection.deleteOne({
      _id: new ObjectId(CommentId),
    });

    return deleteResult.deletedCount !== 0;
  }
}
