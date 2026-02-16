export const authCookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: "none" as const,
  path: "/auth",
};
