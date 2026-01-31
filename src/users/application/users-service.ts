import { usersRepository } from "../repository/users-repository";
import { UserDbModel, UserInputModel } from "../types/users-types";
import { BlogNotFoundError } from "./errors/users-errors";

export const usersService = {
  async createUser(dto: UserInputModel): Promise<string> {
    const newUser: UserDbModel = {};

    return usersRepository.createUser(newUser);
  },

  async deleteUser(blogId: string): Promise<void> {
    const result = await usersRepository.deleteUser(blogId);

    if (!result) {
      throw new BlogNotFoundError();
    }
  },
};
