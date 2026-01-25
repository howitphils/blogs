export enum SortDirections {
  ASC = "asc",
  DESC = "desc",
}

export enum SortByOptions {
  CREATED_AT = "createdAt",
}

export interface BaseQueryParams {
  pageNumber: number;
  pageSize: number;
  sortBy: SortByOptions;
  sortDirection: SortDirections;
}
