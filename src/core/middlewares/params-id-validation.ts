import { param } from "express-validator";

export const validateParamsId = param("id")
  .exists()
  .withMessage("ID parameter is required")
  .isString()
  .withMessage("ID must be a string")
  .notEmpty()
  .withMessage("ID cannot be empty")
  .isNumeric()
  .withMessage("ID must be a numeric string");
