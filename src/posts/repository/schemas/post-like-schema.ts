import { Schema } from "mongoose";
import { PostLikeDbModel } from "../../types/posts-types";

export const postLikeSchema = new Schema<PostLikeDbModel>({
  postId: { type: String, required: true },
  status: { type: String, required: true },
  userId: { type: String, required: true },
  login: { type: String, required: true },
  createdAt: { type: String, required: true },
});
