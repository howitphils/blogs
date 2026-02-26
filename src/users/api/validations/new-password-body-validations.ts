import { body } from "express-validator";
import { userInputRestrictions } from "./users-input-restricitions";

export const validateNewPasswordBody = [
  body("newPassword")
    .exists()
    .withMessage("New password is required")
    .isString()
    .withMessage("New password must be a string")
    .trim()
    .notEmpty()
    .withMessage("New password must be a non-empty string")
    .isLength({
      min: userInputRestrictions.password.minLength,
      max: userInputRestrictions.password.maxLength,
    })
    .withMessage(
      `New password must be between ${userInputRestrictions.password.minLength} and ${userInputRestrictions.password.maxLength} characters`,
    ),

  body("recoveryCode")
    .exists()
    .withMessage("Recovery code is required")
    .isString()
    .withMessage("Recovery code must be a string")
    .trim()
    .notEmpty()
    .withMessage("Recovery code must be a non-empty string"),
];
