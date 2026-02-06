import { UnauthorizedError } from "../../core/middlewares/error-handling/custom-errors/unauthorized-error";
import { usersRepository } from "../repository/users-repository";
import {
  LoginInputModel,
  LoginOutput,
  UserDbModel,
  UserInputModel,
} from "../types/users-types";
import { NotUniqueUserError, UserNotFoundError } from "./errors/users-errors";
import { passwordService } from "../../core/services/password-service";
import { tokenService } from "../../core/services/token-service";

export const usersService = {
  async createUser(dto: UserInputModel): Promise<string> {
    await usersService.checkUnique(dto.login, dto.email);

    const passwordHash = await passwordService.generateHash(dto.password);

    const newUser: UserDbModel = {
      login: dto.login,
      email: dto.email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    return usersRepository.createUser(newUser);
  },

  async deleteUser(blogId: string): Promise<void> {
    const isDeleted = await usersRepository.deleteUser(blogId);

    if (!isDeleted) {
      throw new UserNotFoundError();
    }
  },

  async loginUser(dto: LoginInputModel): Promise<LoginOutput> {
    const user = await usersRepository.getUserByLoginOrEmail(dto.loginOrEmail);

    if (!user) {
      throw new UnauthorizedError("User was not found");
    }

    const isVerified = await passwordService.verifyHash(
      user.passwordHash,
      dto.password,
    );

    if (!isVerified) {
      throw new UnauthorizedError("User is not verified");
    }

    const accessToken = tokenService.createAccessToken(user._id.toString());

    return { accessToken };
  },

  async checkUnique(login: string, email: string): Promise<void> {
    const existingUser = await usersRepository.getExistingUser(login, email);

    if (existingUser) {
      const field = existingUser.email === email ? "email" : "login";

      throw new NotUniqueUserError(field);
    }
  },
};
