import { BlogViewModel } from "../blogs/types/blogs-types";
import { PostViewModel } from "../posts/types/posts-types";

export type MemoryDbType = {
  blogs: BlogViewModel[];
  posts: PostViewModel[];
};

export const db: MemoryDbType = {
  blogs: [],
  posts: [],
};
