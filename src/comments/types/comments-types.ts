import { HydratedDocument } from "mongoose";
import { LikeInfoViewModel, LikeStatuses } from "../../core/types/likes-types";

export type CommentInputModel = {
  content: string; //max:300;min:20
};

export type UpdateLikeStatusInputModel = {
  likeStatus: LikeStatuses;
};

export type CreateCommentDto = {
  content: string;
  postId: string;
  userId: string;
};

export type UpdateCommentDto = {
  id: string;
  content: string;
  userId: string;
};

export type UpdateCommentLikeStatusDto = {
  userId: string;
  commentId: string;
  likeStatus: LikeStatuses;
};

export type CommentDbModel = {
  content: string;
  userId: string;
  postId: string;
  userLogin: string;
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
};

export type CommentLikeDbModel = {
  commentId: string;
  userId: string;
  status: LikeStatuses;
  createdAt: Date;
};

export type CommentLikeDbDocument = HydratedDocument<CommentLikeDbModel>;

export type CommentDbDocument = HydratedDocument<CommentDbModel>;

export type CommentatorInfoViewModel = {
  userId: string;
  userLogin: string;
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoViewModel;
  createdAt: string;
  likesInfo: LikeInfoViewModel;
};
