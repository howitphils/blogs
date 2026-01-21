import { BlogViewModel } from "../blogs/types/blogs-types";
import { PostViewModel } from "../posts/types/posts-types";

export type MemoryDbType = {
  blogs: BlogViewModel[];
  posts: PostViewModel[];
};

export const db = {
  blogs: [
    {
      id: "1",
      name: "First Blog",
      description: "This is the first blog",
      websiteUrl: "https://firstblog.com",
    },
  ],
  posts: [
    {
      id: "1",
      title: "First Post",
      shortDescription: "This is the first post",
      content: "Content of the first post",
      blogId: "1",
      blogName: "First Blog",
    },
  ],
};
