import { PostDbDocument, PostViewModel } from "../types/posts-types";
import { PaginationType } from "../../core/types/pagination-types";
import { BaseQueryParams } from "../../core/types/query-params-types";
import { PostNotFoundError } from "../application/errors/posts-errors";
import { BlogsQueryRepository } from "../../blogs/repository/blogs-query-repository";
import { inject, injectable } from "inversify";
import { PostModel } from "./schemas/post-schema";

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

    const posts = await PostModel.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection });

    const totalCount = await PostModel.countDocuments(filter);

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize,
      totalCount,
      items: posts.map(this.mapFromDbToView),
    };
  }

  async getPostByIdOrFail(id: string): Promise<PostViewModel> {
    const dbPost = await PostModel.findById(id).orFail(new PostNotFoundError());

    return this.mapFromDbToView(dbPost);
  }

  private mapFromDbToView(post: PostDbDocument): PostViewModel {
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
