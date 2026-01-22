import { body } from "express-validator";

export const validatePostBody = [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters"),
  body("content")
    .isString()
    .withMessage("Content must be a string")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Content must be between 1 and 1000 characters"),
  body("shortDescription")
    .isString()
    .withMessage("Short description must be a string")
    .isLength({ min: 1, max: 300 })
    .withMessage("Short description must be between 1 and 300 characters"),
  body("blogId")
    .isString()
    .withMessage("Blog ID must be a string")
    .notEmpty()
    .withMessage("Blog ID is required")
    .isNumeric()
    .withMessage("Blog ID must be a numeric value"),
];
