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
};
