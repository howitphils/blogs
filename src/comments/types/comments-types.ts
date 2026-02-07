export type CommentInputModel = {
  content: string; //max:300;min:20
};

export type CreateCommentDto = {
  content: string;
  postId: string;
  userId: string;
};

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type UpdateCommentDto = {
  id: string;
  content: string;
  userId: string;
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
};

export type CommentDbModel = {
  content: string;
  userId: string;
  postId: string;
  userLogin: string;
  createdAt: string;
};
