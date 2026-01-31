import { query } from "express-validator";
import { validateQueryParams } from "../../../core/middlewares/validation/base-query-validations";

export const validateBlogQueryParams = [
  ...validateQueryParams,
  query("searchNameTerm").default(null),
];
