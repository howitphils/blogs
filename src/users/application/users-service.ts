import { usersRepository } from "../repository/users-repository";
import { UserDbModel, UserInputModel } from "../types/users-types";
import { NotUniqueUserError, UserNotFoundError } from "./errors/users-errors";
import { passwordService } from "./services/password-service";

export const usersService = {
  async createUser(dto: UserInputModel): Promise<string> {
    await usersService.checkUnique(dto.login, dto.email);

    const passwordHash = await passwordService.generateHash(dto.password);

    const newUser: UserDbModel = {
      login: dto.login,
      email: dto.email,
      passwordHash,
      createAt: new Date().toISOString(),
    };

    return usersRepository.createUser(newUser);
  },

  async deleteUser(blogId: string): Promise<void> {
    const isDeleted = await usersRepository.deleteUser(blogId);

    if (!isDeleted) {
      throw new UserNotFoundError();
    }
  },

  async checkUnique(login: string, email: string): Promise<void> {
    const existingUser = await usersRepository.getUserByLoginOrEmail(
      login,
      email,
    );

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "login";

      throw new NotUniqueUserError(field);
    }
  },
};
