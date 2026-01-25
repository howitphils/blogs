import { param } from "express-validator";
import { ObjectId } from "mongodb";

export const validateParamsId = param("id")
  .exists()
  .withMessage("ID parameter is required")
  .isString()
  .withMessage("ID must be a string")
  .notEmpty()
  .withMessage("ID cannot be empty")
  .custom((id) => {
    return ObjectId.isValid(id);
  })
  .withMessage("ID must be a valid type");
