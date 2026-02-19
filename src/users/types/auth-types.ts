export type LoginInputModel = {
  loginOrEmail: string;
  password: string;
};

export type LoginInfo = {
  loginOrEmail: string;
  password: string;
  ip: string;
  deviceName: string;
};

export type MeInfoViewModel = {
  email: string;
  login: string;
  userId: string;
};

export type TokenPairModel = {
  accessToken: string;
  refreshToken: string;
};

export type AccessTokenOutput = {
  accessToken: string;
};

export type ConfirmEmailBody = {
  code: string;
};

export type ResendEmailBody = {
  email: string;
};
