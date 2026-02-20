export const appSettings = {
  emailSubjects: {
    registration: "registration",
    passwordRecovery: "password recovery",
  },
  mainPaths: {
    BLOGS: "/blogs",
    POSTS: "/posts",
    USERS: "/users",
    AUTH: "/auth",
    COMMENTS: "/comments",
    TESTING: "/testing",
    DEVICES: "/security",
  },
  rateLimit: {
    windowMs: 10 * 1000, // 10 seconds
    requestLimit: 3,
    errorMessage: "Too many requests",
  },
};
