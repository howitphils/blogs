import { model, Schema } from "mongoose";
import { BlogDbModel } from "../../types/blogs-types";

const blogSchema = new Schema<BlogDbModel>({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 1000,
    trim: true,
  },
  websiteUrl: {
    type: String,
    required: true,
    match:
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  },
  createdAt: { type: String, required: true },
  isMemberShip: { type: Boolean, required: true, default: false },
});

export const BlogModel = model("Blogs", blogSchema);
