import { query } from "express-validator";
import { SortByOptions, SortDirections } from "../../types/query-params-types";
import { appConfig } from "../../../app-config";

const sortByOptionsArr = Object.values(SortByOptions);
const sortDirectionsArr = Object.values(SortDirections);

export const validateQueryParams = [
  query("pageNumber")
    .default(appConfig.PAGINATION.DEFAULT_PAGE_NUMBER)
    .isInt({ min: 1 })
    .toInt(),

  query("pageSize")
    .default(appConfig.PAGINATION.DEFAULT_PAGE_SIZE)
    .isInt({ min: 1, max: 100 })
    .withMessage("Page size must be a positive number")
    .toInt(),

  query("sortBy")
    .default(appConfig.PAGINATION.DEFAULT_SORT_BY)
    .isIn(sortByOptionsArr)
    .withMessage(
      `Available fields for sorting: ${sortByOptionsArr.join(", ")}`,
    ),

  query("sortDirection")
    .default(appConfig.PAGINATION.DEFAULT_SORT_DIRECTION)
    .isIn(sortDirectionsArr)
    .withMessage(
      `Available sorting directions: ${sortDirectionsArr.join(", ")}`,
    ),
];
