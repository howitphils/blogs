import { ObjectId, WithId } from "mongodb";
import { BlogDbModel, BlogViewModel } from "../types/blogs-types";
import { blogsCollection } from "../../db/mongodb";

export const blogsQueryRepository = {
  async getBlogs() {
    const blogs = await blogsCollection.find({}).toArray();

    return blogs.map(blogsQueryRepository.mapFromDbToView);
  },
  async getBlogById(id: string): Promise<BlogViewModel | null> {
    const dbBlog = await blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!dbBlog) {
      return null;
    }

    return blogsQueryRepository.mapFromDbToView(dbBlog);
  },

  mapFromDbToView(blog: WithId<BlogDbModel>): BlogViewModel {
    return {
      id: blog._id.toString(),
      description: blog.description,
      name: blog.name,
      websiteUrl: blog.websiteUrl,
    };
  },
};
