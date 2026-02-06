import { body } from "express-validator";
import { commentInputRestrictions } from "./comment-input-restrictions";

export const validateCommentBody = [
  body("content")
    .exists()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string")
    .trim()
    .isLength({
      min: commentInputRestrictions.content.minLength,
      max: commentInputRestrictions.content.maxLength,
    })
    .withMessage("Content must be between 1 and 1000 characters"),
];
