import { body } from "express-validator";

export const validateConfirmEmailBody = [
  body("code")
    .exists()
    .withMessage("Confirmation code is required")
    .isString()
    .withMessage("Confirmation code must be a string")
    .trim()
    .notEmpty()
    .withMessage("Confirmation code must be a non-empty string"),
];
