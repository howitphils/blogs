import { BaseQueryParams } from "../../core/types/query-params-types";

export type UserInputModel = {
  login: string; // max length 10, min: 3, unique, pattern: ^[a-zA-Z0-9_-]*$
  password: string; // max length 20, min 6,
  email: string; // unique, pattern: ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$
};

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type UserDbModel = {
  login: string;
  passwordHash: string;
  email: string;
  createAt: string;
};

export interface UserQueryParams extends BaseQueryParams {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
}
