import {
  PostDbDocument,
  PostLikeDbModel,
  PostViewModel,
} from "../types/posts-types";
import { PaginationType } from "../../core/types/pagination-types";
import { BaseQueryParams } from "../../core/types/query-params-types";
import { PostNotFoundError } from "../application/errors/posts-errors";
import { BlogsQueryRepository } from "../../blogs/repository/blogs-query-repository";
import { inject, injectable } from "inversify";
import { PostModel } from "./schemas/post-schema";
import { LikeStatuses, UsersLikeStatuses } from "../../core/types/likes-types";

@injectable()
export class PostsQueryRepository {
  constructor(
    @inject(BlogsQueryRepository)
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async getPosts(
    params: BaseQueryParams,
    blogId?: string,
    userId?: string,
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

    let userLikeStatuses: UsersLikeStatuses = {};

    if (userId) {
      userLikeStatuses = posts.reduce((acc: UsersLikeStatuses, post) => {
        const userLike = post.likes.find((like) => like.userId === userId);

        if (userLike) {
          acc[post.id] = userLike.status;
          return acc;
        }

        return acc;
      }, {});
    }

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize,
      totalCount,
      items: posts.map((post) =>
        this.mapFromDbToView(
          post,
          userLikeStatuses[post.id] || LikeStatuses.NONE,
        ),
      ),
    };
  }

  async getPostByIdOrFail(id: string, userId?: string): Promise<PostViewModel> {
    const dbPost = await PostModel.findById(id).orFail(new PostNotFoundError());

    let userLikeStatus: LikeStatuses = LikeStatuses.NONE;

    if (userId) {
      const userLike = dbPost.likes.find((like) => like.userId === userId);

      if (userLike) {
        userLikeStatus = userLike.status;
      }
    }

    return this.mapFromDbToView(dbPost, userLikeStatus);
  }

  private mapFromDbToView(
    post: PostDbDocument,
    userLikeStatus: LikeStatuses,
  ): PostViewModel {
    return {
      id: post._id.toString(),
      blogId: post.blogId,
      blogName: post.blogName,
      shortDescription: post.shortDescription,
      content: post.content,
      title: post.title,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: post.likesCount,
        dislikesCount: post.dislikesCount,
        myStatus: userLikeStatus,
        newestLikes: this.getNewestLikes(post.likes),
      },
    };
  }

  private getNewestLikes(likes: PostLikeDbModel[]) {
    return likes
      .filter((like) => like.status === LikeStatuses.LIKE)
      .sort((a, b) => {
        if (b.createdAt > a.createdAt) {
          return 1;
        }
        if (b.createdAt < a.createdAt) {
          return -1;
        }

        return 0;
      })
      .slice(0, 3)
      .map((like) => {
        return {
          addedAt: like.createdAt,
          login: like.login,
          userId: like.userId,
        };
      });
  }
}
