import { PostsRepository } from "./../../posts/repository/posts-repository";
import { PaginationType } from "../../core/types/pagination-types";
import { BaseQueryParams } from "../../core/types/query-params-types";
import { CommentDbDocument, CommentViewModel } from "../types/comments-types";
import { calculateSkip } from "../../core/utils/calculate-skip";
import { CommentNotFoundError } from "../application/errors/comments-errors";
import { calculatePagesCount } from "../../core/utils/calculate-pages-count";
import { inject, injectable } from "inversify";
import { CommentModel } from "./schemas/comment-schema";

@injectable()
export class CommentsQueryRepository {
  constructor(
    @inject(PostsRepository) private postsRepository: PostsRepository,
  ) {}

  async getComments(
    params: BaseQueryParams,
    postId: string,
  ): Promise<PaginationType<CommentViewModel>> {
    await this.postsRepository.getPostByIdOrFail(postId);

    const { pageNumber, pageSize, sortBy, sortDirection } = params;

    const filter = { postId };

    const comments = await CommentModel.find(filter)
      .skip(calculateSkip(pageNumber, pageSize))
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection });

    const totalCount = await CommentModel.countDocuments(filter);

    return {
      page: pageNumber,
      pagesCount: calculatePagesCount(totalCount, pageSize),
      pageSize,
      totalCount,
      items: comments.map(this.mapFromDbToView),
    };
  }

  async getCommentByIdOrFail(id: string): Promise<CommentViewModel> {
    const dbComment = await CommentModel.findById(id).orFail(
      new CommentNotFoundError(),
    );

    return this.mapFromDbToView(dbComment);
  }

  private mapFromDbToView(comment: CommentDbDocument): CommentViewModel {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: { userId: comment.userId, userLogin: comment.userLogin },
      createdAt: comment.createdAt,
    };
  }
}
