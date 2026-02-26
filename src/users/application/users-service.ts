import { UnauthorizedError } from "../../core/middlewares/error-handling/custom-errors/unauthorized-error";
import { usersRepository } from "../repository/users-repository";
import { UserInputModel } from "../types/users-types";
import { NotUniqueUserError, UserNotFoundError } from "./errors/users-errors";
import { passwordService } from "../../core/services/password-service";
import { tokenService } from "../../core/services/token-service";
import { LoginInfo, TokenPairModel } from "../types/auth-types";
import { emailService } from "../../core/services/email-service/email-service";
import { dateService } from "../../core/services/date-service";
import { BadRequestError } from "../../core/middlewares/error-handling/custom-errors/bad-request-error";
import { ServerError } from "../../core/middlewares/error-handling/custom-errors/server-error";
import { randomUUID } from "node:crypto";
import { sessionsRepository } from "../repository/sessions-repository";
import { ForbiddenError } from "../../core/middlewares/error-handling/custom-errors/forbidden-error";
import { SessionDbModel } from "../types/sessions-types";
import { User } from "./classes/user";

export const usersService = {
  async addUser(dto: UserInputModel): Promise<string> {
    await usersService._checkUnique(dto.login, dto.email);

    const passwordHash = await passwordService.generateHash(dto.password);
    const user = new User(dto.login, dto.email, passwordHash, true);

    return usersRepository.createUser(user);
  },

  async deleteUser(blogId: string): Promise<void> {
    const isDeleted = await usersRepository.deleteUser(blogId);

    if (!isDeleted) {
      throw new UserNotFoundError();
    }
  },

  async loginUser(dto: LoginInfo): Promise<TokenPairModel> {
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

    const deviceId = tokenService.createRandomCode();
    const userId = user._id.toString();

    const accessToken = tokenService.createAccessToken(userId);
    const refreshToken = tokenService.createRefreshToken(userId, deviceId);

    const { iat, exp } = tokenService.decodeRefreshToken(refreshToken);

    if (!iat || !exp) {
      throw new ServerError("token issuedAt or exp is not available");
    }

    const newSession: SessionDbModel = {
      userId,
      deviceId,
      iat,
      exp,
      deviceName: dto.deviceName,
      ip: dto.ip,
    };

    await sessionsRepository.createSession(newSession);

    return { accessToken, refreshToken };
  },

  async registerUser(dto: UserInputModel): Promise<void> {
    await usersService._checkUnique(dto.login, dto.email);

    const passwordHash = await passwordService.generateHash(dto.password);
    const user = new User(dto.login, dto.email, passwordHash, false);

    await usersRepository.createUser(user);

    emailService
      .sendRegistrationEmail(dto.email, user.emailConfirmation.confirmationCode)
      .catch((err) => {
        console.log("registration", err);
      });
  },

  async refreshTokens(
    userId: string,
    deviceId: string,
  ): Promise<TokenPairModel> {
    const accessToken = tokenService.createAccessToken(userId);
    const refreshToken = tokenService.createRefreshToken(userId, deviceId);

    const { iat, exp } = tokenService.decodeRefreshToken(refreshToken);

    await sessionsRepository.updateSessionIatAndExp(
      deviceId,
      iat as number,
      exp as number,
    );

    return { accessToken, refreshToken };
  },

  async logout(userId: string, deviceId: string): Promise<void> {
    await sessionsRepository.deleteSession(userId, deviceId);
  },

  async confirmEmail(code: string): Promise<boolean> {
    const user = await usersRepository.getUserByConfirmationCode(code);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestError("Email is already confirmed");
    }

    if (user.emailConfirmation.expDate < new Date()) {
      throw new BadRequestError("Confirmation code is already expired");
    }

    const updateResult = await usersRepository.updateIsConfirmed(code);

    if (!updateResult) {
      throw new ServerError("User was not updated");
    }

    return updateResult;
  },

  async emailResending(email: string): Promise<boolean> {
    const user = await usersRepository.getUserByLoginOrEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestError("Email is already confirmed");
    }

    const newConfirmationCode = randomUUID();
    const newExpDate = dateService.addHours(2);

    const updateResult = await usersRepository.updateConfirmationCodeAndExp(
      email,
      newConfirmationCode,
      newExpDate,
    );

    if (!updateResult) {
      throw new ServerError(
        "User was not updated with new email resending values",
      );
    }

    emailService.sendRegistrationEmail(email, newConfirmationCode);

    return updateResult;
  },

  async deleteUsersSession(deviceId: string, userId: string): Promise<void> {
    const session =
      await sessionsRepository.getSessionByDeviceIdOrFail(deviceId);

    if (session.userId !== userId) {
      throw new ForbiddenError("Session does not belong to the user");
    }

    await sessionsRepository.deleteSession(userId, deviceId);
  },

  async deleteAllUsersSessions(
    userId: string,
    deviceId: string,
  ): Promise<void> {
    await sessionsRepository.deleteAllSessions(userId, deviceId);
  },

  async recoverPassword(email: string): Promise<void> {
    const recoveryCode = tokenService.createRandomCode();
    const expDate = dateService.addHours(2);

    await usersRepository.updateRecoveryCode(email, recoveryCode, expDate);

    emailService.sendPasswordRecoveryEmail(email, recoveryCode).catch((err) => {
      console.log("password recovery", err);
    });
  },

  async updatePassword(
    newPassword: string,
    recoveryCode: string,
  ): Promise<void> {
    const user =
      await usersRepository.getUserByRecoveryCodeOrFail(recoveryCode);

    if (user.passwordRecovery.expDate < new Date()) {
      throw new BadRequestError("Recovery code is already expired");
    }

    const passwordHash = await passwordService.generateHash(newPassword);

    await usersRepository.updatePasswordHash(user._id, passwordHash);
  },

  async _checkUnique(login: string, email: string): Promise<void> {
    const existingUser = await usersRepository.getExistingUser(login, email);

    if (existingUser) {
      const field =
        existingUser.accountData.email === email ? "email" : "login";

      throw new NotUniqueUserError(field);
    }
  },
};
