import { PostsRepository } from "./../../posts/repository/posts-repository";
import { ObjectId, WithId } from "mongodb";
import { PaginationType } from "../../core/types/pagination-types";
import { BaseQueryParams } from "../../core/types/query-params-types";
import { ServerError } from "../../core/middlewares/error-handling/custom-errors/server-error";
import { CommentDbModel, CommentViewModel } from "../types/comments-types";
import { calculateSkip } from "../../core/utils/calculate-skip";
import { commentsCollection } from "../../db/mongodb";
import { CommentNotFoundError } from "../application/errors/comments-errors";
import { calculatePagesCount } from "../../core/utils/calculate-pages-count";
import { inject, injectable } from "inversify";

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

    const comments = await commentsCollection
      .find(filter)
      .skip(calculateSkip(pageNumber, pageSize))
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const totalCount = await commentsCollection.countDocuments(filter);

    return {
      page: pageNumber,
      pagesCount: calculatePagesCount(totalCount, pageSize),
      pageSize,
      totalCount,
      items: comments.map(this.mapFromDbToView),
    };
  }

  async getCommentByIdOrFail(id: string): Promise<CommentViewModel> {
    const dbComment = await commentsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!dbComment) {
      throw new CommentNotFoundError();
    }

    return this.mapFromDbToView(dbComment);
  }

  async getCreatedComment(id: string): Promise<CommentViewModel> {
    const dbComment = await commentsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!dbComment) {
      throw new ServerError("Created Comment was not found");
    }

    return this.mapFromDbToView(dbComment);
  }

  private mapFromDbToView(comment: WithId<CommentDbModel>): CommentViewModel {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: { userId: comment.userId, userLogin: comment.userLogin },
      createdAt: comment.createdAt,
    };
  }
}
