import { query } from "express-validator";
import { SortByOptions, SortDirections } from "../../types/query-params-types";

export const validateQueryParams = [
  query("pageNumber").isInt({ min: 1 }).default(1).toInt(),

  query("pageSize")
    .isInt({ min: 1, max: 100 })
    .withMessage("Page size must be a positive number")
    .default(10)
    .toInt(),

  query("sortBy")
    .default(SortByOptions.CREATED_AT)
    .isIn(Object.values(SortByOptions))
    .withMessage(
      `Available fields for sorting: ${Object.values(SortByOptions).join(", ")}`,
    ),

  query("sortDirection")
    .default(SortDirections.DESC)
    .isIn(Object.values(SortDirections))
    .withMessage(
      `Available sorting directions: ${Object.values(SortDirections).join(", ")}`,
    ),
];
