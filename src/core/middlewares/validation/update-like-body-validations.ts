import { body } from "express-validator";
import { LikeStatuses } from "../../types/likes-types";

const availdableLikeStatuses = Object.values(LikeStatuses);

export const validateLikeStatus = body("likeStatus")
  .isIn(availdableLikeStatuses)
  .withMessage(`Available like statuses: ${availdableLikeStatuses.join(", ")}`);
