import { PostsRepository } from "./../../posts/repository/posts-repository";
import { PaginationType } from "../../core/types/pagination-types";
import { BaseQueryParams } from "../../core/types/query-params-types";
import { CommentDbDocument, CommentViewModel } from "../types/comments-types";
import { calculateSkip } from "../../core/utils/calculate-skip";
import { CommentNotFoundError } from "../application/errors/comments-errors";
import { calculatePagesCount } from "../../core/utils/calculate-pages-count";
import { inject, injectable } from "inversify";
import { CommentModel } from "./schemas/comment-schema";
import { CommentLikeModel } from "./schemas/like-schema";
import { LikeStatuses, UsersLikeStatuses } from "../../core/types/likes-types";

@injectable()
export class CommentsQueryRepository {
  constructor(
    @inject(PostsRepository) private postsRepository: PostsRepository,
  ) {}

  //TODO: optional jwt auth guard
  async getComments(
    params: BaseQueryParams,
    postId: string,
    userId?: string,
  ): Promise<PaginationType<CommentViewModel>> {
    await this.postsRepository.getPostByIdOrFail(postId);

    const { pageNumber, pageSize, sortBy, sortDirection } = params;

    const filter = { postId };

    const comments = await CommentModel.find(filter)
      .skip(calculateSkip(pageNumber, pageSize))
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection });

    const totalCount = await CommentModel.countDocuments(filter);

    let usersLikeStatuses: UsersLikeStatuses = {};

    if (userId) {
      const usersLikes = await CommentLikeModel.find({ userId });

      usersLikeStatuses = usersLikes.reduce((acc: UsersLikeStatuses, like) => {
        acc[like.commentId] = like.status;

        return acc;
      }, {});
    }

    return {
      page: pageNumber,
      pagesCount: calculatePagesCount(totalCount, pageSize),
      pageSize,
      totalCount,
      items: comments.map((comment) =>
        this.mapFromDbToView(
          comment,
          usersLikeStatuses[comment.id] || LikeStatuses.NONE,
        ),
      ),
    };
  }

  async getCommentByIdOrFail(
    id: string,
    userId?: string,
  ): Promise<CommentViewModel> {
    const dbComment = await CommentModel.findById(id).orFail(
      new CommentNotFoundError(),
    );

    let usersLikeStatus = LikeStatuses.NONE;

    if (userId) {
      const like = await CommentLikeModel.findOne({ commentId: id, userId });

      if (like) {
        usersLikeStatus = like.status;
      }
    }

    return this.mapFromDbToView(dbComment, usersLikeStatus);
  }

  private mapFromDbToView(
    comment: CommentDbDocument,
    usersLikeStatus: LikeStatuses,
  ): CommentViewModel {
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: { userId: comment.userId, userLogin: comment.userLogin },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesCount,
        dislikesCount: comment.dislikesCount,
        myStatus: usersLikeStatus,
      },
    };
  }
}
