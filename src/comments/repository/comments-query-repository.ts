import { ObjectId, WithId } from "mongodb";
import { PaginationType } from "../../core/types/pagination-types";
import { BaseQueryParams } from "../../core/types/query-params-types";
import { ServerError } from "../../core/middlewares/error-handling/custom-errors/server-error";
import { CommentDbModel, CommentViewModel } from "../types/comments-types";
import { postsRepository } from "../../posts/repository/posts-repository";
import { calculateSkip } from "../../core/utils/calculate-skip";
import { commentsCollection } from "../../db/mongodb";
import { CommentNotFoundError } from "../application/errors/comments-errors";

export const commentsQueryRepository = {
  async getComments(
    params: BaseQueryParams,
    postId: string,
  ): Promise<PaginationType<CommentViewModel>> {
    const { pageNumber, pageSize, sortBy, sortDirection } = params;

    let filter = {};

    if (postId) {
      await postsRepository.getPostByIdOrFail(postId);

      filter = { postId };
    }

    const comments = await commentsCollection
      .find(filter)
      .skip(calculateSkip(pageNumber, pageSize))
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const totalCount = await commentsCollection.countDocuments(filter);

    return {
      page: pageNumber,
      pagesCount: Math.ceil(totalCount / pageSize),
      pageSize,
      totalCount,
      items: comments.map(commentsQueryRepository.mapFromDbToView),
    };
  },

  async getCommentByIdOrFail(id: string): Promise<CommentViewModel> {
    const dbComment = await commentsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!dbComment) {
      throw new CommentNotFoundError();
    }

    return commentsQueryRepository.mapFromDbToView(dbComment);
  },

  async getCreatedComment(id: string): Promise<CommentViewModel> {
    const dbComment = await commentsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!dbComment) {
      throw new ServerError("Created Comment was not found");
    }

    return commentsQueryRepository.mapFromDbToView(dbComment);
  },

  mapFromDbToView(comment: WithId<CommentDbModel>): CommentViewModel {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: { userId: comment.userId, userLogin: comment.userLogin },
      createdAt: comment.createdAt,
    };
  },
};
