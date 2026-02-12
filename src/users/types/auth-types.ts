export type LoginInputModel = {
  loginOrEmail: string;
  password: string;
};

export type MeInfoViewModel = {
  email: string;
  login: string;
  userId: string;
};

export type LoginOutputModel = {
  accessToken: string;
};

export type ConfirmEmailBody = {
  code: string;
};

export type ResendEmailBody = {
  email: string;
};
