import { SortByOptions, SortDirections } from "./core/types/query-params-types";

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
    errorMessage: "Too many requests",
  },
  pagination: {
    DEFAULT_PAGE_NUMBER: 1,
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_SORT_BY: SortByOptions.CREATED_AT,
    DEFAULT_SORT_DIRECTION: SortDirections.DESC,
  },
  errorMessages: {
    INVALID_CREDENTIALS: "Invalid credentials",
    USER_NOT_FOUND: "User not found",
    INVALID_RECOVERY_CODE: "Invalid recovery code",
    INVALID_CONFIRMATION_CODE: "Invalid confirmation code",
    INVALID_TOKEN: "Invalid token",
    TOKEN_EXPIRED: "Token expired",
  },
};
