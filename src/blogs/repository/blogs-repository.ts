import { ObjectId } from "mongodb";
import { blogsCollection } from "../../db/mongodb";
import { BlogDbModel, UpdateBlogDtoModel } from "../types/blogs-types";

export const blogsRepository = {
  async getAllBlogs(): Promise<BlogDbModel[]> {
    return blogsCollection.find({}).toArray();
  },

  async getBlogById(blogId: string): Promise<BlogDbModel | null> {
    const convertedId = new ObjectId(blogId);

    return blogsCollection.findOne({ _id: convertedId });
  },

  async createBlog(blogDto: BlogDbModel): Promise<string> {
    const { insertedId } = await blogsCollection.insertOne(blogDto);

    return insertedId.toString();
  },

  async updateBlog(dto: UpdateBlogDtoModel): Promise<boolean> {
    const updateResult = await blogsCollection.updateOne(
      {
        _id: new ObjectId(dto.blogId),
      },
      {
        $set: {
          description: dto.description,
          name: dto.name,
          websiteUrl: dto.websiteUrl,
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
