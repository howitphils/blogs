import { Request } from "express";

export type RequestWithBody<T> = Request<{}, {}, T>;

export type RequestWithParamsId = Request<{ id: string }>;

export type RequestWithParamsIdAndBody<T> = Request<{ id: string }, {}, T>;

export type RequestWithQuery<TQuery> = Request<{}, {}, {}, TQuery>;

export type RequestWithParamsIdAndQuery<TQuery> = Request<
  { id: string },
  {},
  {},
  TQuery
>;
