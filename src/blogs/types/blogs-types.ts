export type BlogInputModel = {
  name: string; // max length 15
  description: string; // max length 500
  websiteUrl: string; // max length 100, valid URL
};

export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogDbModel = {
  name: string;
  description: string;
  websiteUrl: string;
};
