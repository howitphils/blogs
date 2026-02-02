import { body } from "express-validator";

export const validateLoginBody = [
  body("loginOrEmail")
    .exists()
    .withMessage("Login or Email is required")
    .isString()
    .trim()
    .withMessage("Login or Email must be a non-empty string"),

  body("password")
    .exists()
    .withMessage("Password is required")
    .isString()
    .trim()
    .withMessage("Password must be a non-empty string"),
];
