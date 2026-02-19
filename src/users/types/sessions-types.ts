export type SessionDbModel = {
  userId: string;
  iat: number;
  exp: number;
  deviceId: string;
  deviceName: string;
  ip: string;
};

export type SessionViewModel = {
  ip: string;
  title: string;
  lastActiveDate: number;
  deviceId: string;
};
