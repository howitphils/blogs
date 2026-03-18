import { HydratedDocument } from "mongoose";
import { LikeStatuses } from "../../core/types/likes-types";

export type PostInputModel = {
  title: string; // max length 30
  shortDescription: string; // max length 100
  content: string; // max length 1000
  blogId: string; // must be a valid blog ID
};

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatuses;
    newestLikes: PostLikeViewModel[];
  };
};

export type UpdatePostDtoModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type PostDbModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
  likes: PostLikeDbModel[];
};

export type PostForBlogInputModel = {
  title: string; // max length 30
  shortDescription: string; // max length 100
  content: string; // max length 1000
};

export type PostDbDocument = HydratedDocument<PostDbModel>;

export type PostLikeDbModel = {
  postId: string;
  userId: string;
  login: string;
  status: LikeStatuses;
  createdAt: string;
};

export type UpdatePostLikeStatusDto = {
  postId: string;
  userId: string;
  status: LikeStatuses;
};

export type PostLikeViewModel = {
  addedAt: string;
  userId: string;
  login: string;
};
