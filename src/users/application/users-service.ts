import { UnauthorizedError } from "../../core/middlewares/error-handling/custom-errors/unauthorized-error";
import { usersRepository } from "../repository/users-repository";
import {
  CreateUserDtoType,
  UserDbModel,
  UserInputModel,
} from "../types/users-types";
import { NotUniqueUserError, UserNotFoundError } from "./errors/users-errors";
import { passwordService } from "../../core/services/password-service";
import { tokenService } from "../../core/services/token-service";
import { LoginInputModel, LoginOutputModel } from "../types/auth-types";
import { randomUUID } from "crypto";
import { emailService } from "../../core/services/email-service";
import { dateService } from "../../core/services/date-service";
import { BadRequestError } from "../../core/middlewares/error-handling/custom-errors/bad-request-error";
import { ServerError } from "../../core/middlewares/error-handling/custom-errors/server-error";

export const usersService = {
  async addUser(dto: UserInputModel): Promise<string> {
    await usersService._checkUnique(dto.login, dto.email);

    const createUserDto: CreateUserDtoType = {
      email: dto.email,
      login: dto.login,
      password: dto.password,
      isConfirmed: true,
    };

    const user = await usersService._userFactory(createUserDto);

    return usersRepository.createUser(user);
  },

  async deleteUser(blogId: string): Promise<void> {
    const isDeleted = await usersRepository.deleteUser(blogId);

    if (!isDeleted) {
      throw new UserNotFoundError();
    }
  },

  async loginUser(dto: LoginInputModel): Promise<LoginOutputModel> {
    const user = await usersRepository.getUserByLoginOrEmail(dto.loginOrEmail);

    if (!user) {
      throw new UnauthorizedError("User was not found");
    }

    const isVerified = await passwordService.verifyHash(
      user.accountData.passwordHash,
      dto.password,
    );

    if (!isVerified) {
      throw new UnauthorizedError("User is not verified");
    }

    const accessToken = tokenService.createAccessToken(user._id.toString());

    return { accessToken };
  },

  async registerUser(dto: UserInputModel) {
    await usersService._checkUnique(dto.login, dto.email);

    const createUserDto: CreateUserDtoType = {
      login: dto.login,
      email: dto.email,
      password: dto.password,
      isConfirmed: false,
    };

    const user = await usersService._userFactory(createUserDto);

    await usersRepository.createUser(user);

    emailService.sendRegistrationEmail(
      dto.email,
      user.emailConfirmation.confirmationCode,
    );
  },

  async confirmEmail(code: string) {
    const user = await usersRepository.getUserByConfirmationCode(code);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.emailConfirmation.expDate < new Date()) {
      throw new BadRequestError("Confirmation code is already expired");
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestError("Email already confirmed");
    }

    const updateResult = await usersRepository.confirmEmail(code);

    if (!updateResult) {
      throw new ServerError("User was not updated");
    }
  },

  async _checkUnique(login: string, email: string): Promise<void> {
    const existingUser = await usersRepository.getExistingUser(login, email);

    if (existingUser) {
      const field =
        existingUser.accountData.email === email ? "email" : "login";

      throw new NotUniqueUserError(field);
    }
  },

  async _userFactory(dto: CreateUserDtoType): Promise<UserDbModel> {
    const passwordHash = await passwordService.generateHash(dto.password);

    const newUser: UserDbModel = {
      accountData: {
        login: dto.login,
        email: dto.email,
        passwordHash,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expDate: dateService.addHours(2),
        isConfirmed: dto.isConfirmed,
      },
    };

    return newUser;
  },
};
