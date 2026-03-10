import { ObjectId, WithId } from "mongodb";
import { postsCollection } from "../../db/mongodb";
import { PostDbModel, PostViewModel } from "../types/posts-types";
import { PaginationType } from "../../core/types/pagination-types";
import { BaseQueryParams } from "../../core/types/query-params-types";
import { PostNotFoundError } from "../application/errors/posts-errors";
import { ServerError } from "../../core/middlewares/error-handling/custom-errors/server-error";
import { BlogsQueryRepository } from "../../blogs/repository/blogs-query-repository";
import { inject, injectable } from "inversify";

@injectable()
export class PostsQueryRepository {
  constructor(
    @inject(BlogsQueryRepository)
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async getPosts(
    params: BaseQueryParams,
    blogId?: string,
  ): Promise<PaginationType<PostViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = params;

    let filter = {};

    if (blogId) {
      await this.blogsQueryRepository.getBlogByIdOrFail(blogId);

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
      items: posts.map(this.mapFromDbToView),
    };
  }

  async getPostByIdOrFail(id: string): Promise<PostViewModel> {
    const dbPost = await postsCollection.findOne({ _id: new ObjectId(id) });

    if (!dbPost) {
      throw new PostNotFoundError();
    }

    return this.mapFromDbToView(dbPost);
  }

  async getCreatedPost(id: string): Promise<PostViewModel> {
    const dbPost = await postsCollection.findOne({ _id: new ObjectId(id) });

    if (!dbPost) {
      throw new ServerError("Created post was not found");
    }

    return this.mapFromDbToView(dbPost);
  }

  private mapFromDbToView(post: WithId<PostDbModel>): PostViewModel {
    return {
      id: post._id.toString(),
      blogId: post.blogId,
      blogName: post.blogName,
      shortDescription: post.shortDescription,
      content: post.content,
      title: post.title,
      createdAt: post.createdAt,
    };
  }
}
