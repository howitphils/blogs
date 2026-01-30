import { ObjectId, WithId } from "mongodb";
import { postsCollection } from "../../db/mongodb";
import { PostDbModel, PostViewModel } from "../types/posts-types";
import { PaginationType } from "../../core/types/pagination-types";
import { BaseQueryParams } from "../../core/types/query-params-types";
import { blogsQueryRepository } from "../../blogs/repository/blogs-query-repository";
import {
  PostNotFoundError,
  PostNotFoundInternalError,
} from "../application/errors/posts-errors";

export const postsQueryRepository = {
  async getPosts(
    params: BaseQueryParams,
    blogId?: string,
  ): Promise<PaginationType<PostViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = params;

    let filter = {};

    if (blogId) {
      await blogsQueryRepository.getBlogByIdOrFail(blogId);

      filter = { blogId };
    }

    const skip = (pageNumber - 1) * pageSize;

    const posts = await postsCollection
      .find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const totalCount = await postsCollection.countDocuments(filter);

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize,
      totalCount,
      items: posts.map(postsQueryRepository.mapFromDbToView),
    };
  },

  async getPostByIdOrFail(id: string): Promise<PostViewModel> {
    const dbPost = await postsCollection.findOne({ _id: new ObjectId(id) });

    if (!dbPost) {
      throw new PostNotFoundError();
    }

    return postsQueryRepository.mapFromDbToView(dbPost);
  },

  async getCreatedPost(id: string): Promise<PostViewModel> {
    const dbPost = await postsCollection.findOne({ _id: new ObjectId(id) });

    if (!dbPost) {
      throw new PostNotFoundInternalError();
    }

    return postsQueryRepository.mapFromDbToView(dbPost);
  },

  mapFromDbToView(post: WithId<PostDbModel>): PostViewModel {
    return {
      id: post._id.toString(),
      blogId: post.blogId,
      blogName: post.blogName,
      shortDescription: post.shortDescription,
      content: post.content,
      title: post.title,
      createdAt: post.createdAt,
    };
  },
};
