import { model, Schema } from "mongoose";
import { PostDbModel } from "../../types/posts-types";
import { postLikeSchema } from "./post-like-schema";

const postSchema = new Schema<PostDbModel>({
  title: { type: String, required: true, minlength: 1, maxlength: 50 },
  blogName: { type: String, required: true, minlength: 1, maxlength: 50 },
  content: { type: String, required: true },
  shortDescription: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 150,
  },
  createdAt: { type: String, required: true },
  blogId: { type: String, required: true },
  likes: { type: [postLikeSchema], required: true, default: [] },
  likesCount: { type: Number, required: true, default: 0, min: 0 },
  dislikesCount: { type: Number, required: true, default: 0, min: 0 },
});

export const PostModel = model("Posts", postSchema);
