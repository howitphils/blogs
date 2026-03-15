import { body } from "express-validator";
import { LikeStatuses } from "../../types/likes-types";

const availdableLikeStatuses = Object.values(LikeStatuses);

export const validateLikeStatus = body("likeStatus")
  .exists()
  .withMessage("likeStatus is a required field")
  .isString()
  .withMessage("likeStatus must be a string")
  .trim()
  .notEmpty()
  .withMessage("likeStatus must be a non empty string")
  .isIn(availdableLikeStatuses)
  .withMessage(`Available like statuses: ${availdableLikeStatuses.join(", ")}`);
