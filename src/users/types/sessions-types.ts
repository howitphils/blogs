export type SessionDbModel = {
  userId: string;
  iat: string;
  deviceId: string;
  deviceName: string;
  ip: string;
};

export type SessionViewModel = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};
