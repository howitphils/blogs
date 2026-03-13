export enum LikeStatuses {
  NONE = "None",
  DISLIKE = "Dislike",
  LIKE = "Like",
}

export type LikeInfoViewModel = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatuses;
};
