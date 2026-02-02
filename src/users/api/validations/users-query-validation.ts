import { query } from "express-validator";
import { validateQueryParams } from "../../../core/middlewares/validation/base-query-validations";

export const validateUserQueryParams = [
  ...validateQueryParams,
  query("searchLoginTerm").default(null),
  query("searchEmailTerm").default(null),
];
