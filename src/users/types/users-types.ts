import { HydratedDocument } from "mongoose";
import { BaseQueryParams } from "../../core/types/query-params-types";
import { User } from "../application/classes/user";

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

export type CreateUserDtoType = {
  login: string;
  password: string;
  email: string;
  isConfirmed: boolean;
};

export interface UserQueryParams extends BaseQueryParams {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
}

export type UserDbDocumentType = HydratedDocument<User>;
