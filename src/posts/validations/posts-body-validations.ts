import { body } from "express-validator";

export const validatePostBody = [
  body("title")
    .exists()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters"),
  body("content")
    .exists()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Content must be between 1 and 1000 characters"),
  body("shortDescription")
    .exists()
    .withMessage("Short description is required")
    .isString()
    .withMessage("Short description must be a string")
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage("Short description must be between 1 and 300 characters"),
  body("blogId")
    .exists()
    .withMessage("blogId is required")
    .isString()
    .withMessage("Blog ID must be a string")
    .trim()
    .notEmpty()
    .withMessage("Blog ID is required")
    .isNumeric()
    .withMessage("Blog ID must be a numeric value"),
];
