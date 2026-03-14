import { model, Schema } from "mongoose";
import { CommentLikeDbModel } from "../../types/comments-types";

const commentLikeSchema = new Schema<CommentLikeDbModel>(
  {
    commentId: { type: String, required: true },
    status: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true },
);

export const CommentLikeModel = model("CommentLikes", commentLikeSchema);
