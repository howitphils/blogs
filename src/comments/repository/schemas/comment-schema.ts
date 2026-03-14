import { model, Schema } from "mongoose";
import { CommentDbModel } from "../../types/comments-types";

const commentSchema = new Schema<CommentDbModel>({
  content: { type: String, required: true, trim: true, minLength: 1 },
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  userLogin: { type: String, required: true, trim: true, minlength: 1 },
  createdAt: { type: String, required: true },
  likesCount: { type: Number, required: true, default: 0, min: 0 },
  dislikesCount: { type: Number, required: true, default: 0, min: 0 },
});

export const CommentModel = model("Comments", commentSchema);
