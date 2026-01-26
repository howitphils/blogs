import { ObjectId, WithId } from "mongodb";
import { postsCollection } from "../../db/mongodb";
import { PostDbModel, PostViewModel } from "../types/posts-types";
import { PaginationType } from "../../core/types/pagination-types";
import { BaseQueryParams } from "../../core/types/query-params-types";

export const postsQueryRepository = {
  async getPosts(
    params: BaseQueryParams,
  ): Promise<PaginationType<PostViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = params;

    const skip = (pageNumber - 1) * pageSize;

    const posts = await postsCollection
      .find()
      .skip(skip)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const totalCount = await postsCollection.countDocuments();

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize,
      totalCount,
      items: posts.map(postsQueryRepository.mapFromDbToView),
    };
  },

  async getPostById(id: string): Promise<PostViewModel | null> {
    const dbPost = await postsCollection.findOne({ _id: new ObjectId(id) });

    if (!dbPost) {
      return null;
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
