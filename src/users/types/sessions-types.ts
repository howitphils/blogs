export type SessionDbModel = {
  userId: string;
  iat: number;
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
