import { ObjectId } from "mongodb";
import { blogsCollection } from "../../db/mongodb";
import { BlogDbModel, BlogInputModel } from "../types/blogs-types";

export const blogsRepository = {
  async getAllBlogs(): Promise<BlogDbModel[]> {
    return blogsCollection.find({}).toArray();
  },

  async getBlogById(blogId: string): Promise<BlogDbModel | null> {
    const convertedId = new ObjectId(blogId);

    return blogsCollection.findOne({ _id: convertedId });
  },

  async createBlog(blogDto: BlogInputModel): Promise<string> {
    const newBlog: BlogDbModel = {
      name: blogDto.name,
      description: blogDto.description,
      websiteUrl: blogDto.websiteUrl,
    };

    const { insertedId } = await blogsCollection.insertOne(newBlog);

    return insertedId.toString();
  },

  async updateBlog(blogId: string, blogDto: BlogInputModel): Promise<boolean> {
    const updateResult = await blogsCollection.updateOne(
      {
        _id: new ObjectId(blogId),
      },
      {
        $set: {
          description: blogDto.description,
          name: blogDto.name,
          websiteUrl: blogDto.websiteUrl,
        },
      },
    );

    return updateResult.matchedCount !== 0;
  },

  async deleteBlog(blogId: string): Promise<boolean> {
    const deleteResult = await blogsCollection.deleteOne({
      _id: new ObjectId(blogId),
    });

    return deleteResult.deletedCount !== 0;
  },
};
