import { body } from "express-validator";

export const validateEmailBody = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be a string")
    .trim()
    .notEmpty()
    .withMessage("Email must be not empty")
    .isEmail()
    .withMessage("Incorrect email"),
];
