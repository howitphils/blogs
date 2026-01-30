import { ObjectId } from "mongodb";
import { blogsCollection } from "../../db/mongodb";
import { BlogDbModel, UpdateBlogDtoModel } from "../types/blogs-types";
import { ErrorResponseWithMessage } from "../../core/middlewares/error-handling/error-handler";
import { HttpStatus } from "../../core/types/http-status-types";

export const blogsRepository = {
  async getAllBlogs(): Promise<BlogDbModel[]> {
    return blogsCollection.find({}).toArray();
  },

  async getBlogByIdOrFail(blogId: string): Promise<BlogDbModel> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });

    if (!blog) {
      throw new ErrorResponseWithMessage(
        "Blog was not found",
        HttpStatus.NOT_FOUND,
      );
    }

    return blog;
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
