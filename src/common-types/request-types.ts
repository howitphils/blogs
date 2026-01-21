import { Request } from "express";

export type RequestWithBody<T> = Request<{}, {}, T>;

export type RequestWithParams<T> = Request<T>;

export type RequestWithParamsId = Request<{ id: string }>;

export type RequestWithParamsIdAndBody<T> = Request<{ id: string }, {}, T>;

export type RequestWithParamsAndBody<TParams, TBody> = Request<
  TParams,
  {},
  TBody
>;

export type RequestWithquery<TQuery> = Request<{}, {}, {}, TQuery>;
