import { UnauthorizedError } from "../../core/middlewares/error-handling/custom-errors/unauthorized-error";
import { UsersRepository } from "../repository/users-repository";
import { UserInputModel } from "../types/users-types";
import { NotUniqueUserError, UserNotFoundError } from "./errors/users-errors";
import { LoginInfo, TokenPairModel } from "../types/auth-types";
import { BadRequestError } from "../../core/middlewares/error-handling/custom-errors/bad-request-error";
import { ServerError } from "../../core/middlewares/error-handling/custom-errors/server-error";
import { ForbiddenError } from "../../core/middlewares/error-handling/custom-errors/forbidden-error";
import { SessionDbModel } from "../types/sessions-types";
import { User } from "./classes/user";
import { EmailService } from "../../core/services/email-service/email-service";
import { TokenService } from "../../core/services/token-service";
import { DateService } from "../../core/services/date-service";
import { PasswordService } from "../../core/services/password-service";
import { SessionsRepository } from "../repository/sessions-repository";
import { inject, injectable } from "inversify";

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(SessionsRepository) private sessionsRepository: SessionsRepository,
    @inject(PasswordService) private passwordService: PasswordService,
    @inject(EmailService) private emailService: EmailService,
    @inject(TokenService) private tokenService: TokenService,
    @inject(DateService) private dateService: DateService,
  ) {}

  async addUser(dto: UserInputModel): Promise<string> {
    await this._checkUnique(dto.login, dto.email);

    const passwordHash = await this.passwordService.generateHash(dto.password);
    const user = new User(dto.login, dto.email, passwordHash, true);

    return this.usersRepository.createUser(user);
  }

  async deleteUser(blogId: string): Promise<void> {
    const isDeleted = await this.usersRepository.deleteUser(blogId);

    if (!isDeleted) {
      throw new UserNotFoundError();
    }
  }

  async loginUser(dto: LoginInfo): Promise<TokenPairModel> {
    const user = await this.usersRepository.getUserByLoginOrEmail(
      dto.loginOrEmail,
    );

    if (!user) {
      throw new UnauthorizedError("User was not found");
    }

    const isVerified = await this.passwordService.verifyHash(
      user.accountData.passwordHash,
      dto.password,
    );

    if (!isVerified) {
      throw new UnauthorizedError("User is not verified");
    }

    const deviceId = this.tokenService.createRandomCode();
    const userId = user._id.toString();

    const accessToken = this.tokenService.createAccessToken(userId);
    const refreshToken = this.tokenService.createRefreshToken(userId, deviceId);

    const { iat, exp } = this.tokenService.decodeRefreshToken(refreshToken);

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

    await this.sessionsRepository.createSession(newSession);

    return { accessToken, refreshToken };
  }

  async registerUser(dto: UserInputModel): Promise<void> {
    await this._checkUnique(dto.login, dto.email);

    const passwordHash = await this.passwordService.generateHash(dto.password);
    const user = new User(dto.login, dto.email, passwordHash, false);

    await this.usersRepository.createUser(user);

    this.emailService
      .sendRegistrationEmail(dto.email, user.emailConfirmation.confirmationCode)
      .catch((err) => {
        console.log("registration", err);
      });
  }

  async refreshTokens(
    userId: string,
    deviceId: string,
  ): Promise<TokenPairModel> {
    const accessToken = this.tokenService.createAccessToken(userId);
    const refreshToken = this.tokenService.createRefreshToken(userId, deviceId);

    const { iat, exp } = this.tokenService.decodeRefreshToken(refreshToken);

    await this.sessionsRepository.updateSessionIatAndExp(
      deviceId,
      iat as number,
      exp as number,
    );

    return { accessToken, refreshToken };
  }

  async logout(userId: string, deviceId: string): Promise<void> {
    await this.sessionsRepository.deleteSession(userId, deviceId);
  }

  async confirmEmail(code: string): Promise<boolean> {
    const user = await this.usersRepository.getUserByConfirmationCode(code);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestError("Email is already confirmed");
    }

    if (user.emailConfirmation.expDate < new Date()) {
      throw new BadRequestError("Confirmation code is already expired");
    }

    const updateResult = await this.usersRepository.updateIsConfirmed(code);

    if (!updateResult) {
      throw new ServerError("User was not updated");
    }

    return updateResult;
  }

  async resendEmail(email: string): Promise<boolean> {
    const user = await this.usersRepository.getUserByLoginOrEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestError("Email is already confirmed");
    }

    const newConfirmationCode = this.tokenService.createRandomCode();
    const newExpDate = this.dateService.addHours(2);

    const updateResult =
      await this.usersRepository.updateConfirmationCodeAndExp(
        email,
        newConfirmationCode,
        newExpDate,
      );

    if (!updateResult) {
      throw new ServerError(
        "User was not updated with new email resending values",
      );
    }

    this.emailService.sendRegistrationEmail(email, newConfirmationCode);

    return updateResult;
  }

  async deleteUsersSession(deviceId: string, userId: string): Promise<void> {
    const session =
      await this.sessionsRepository.getSessionByDeviceIdOrFail(deviceId);

    if (session.userId !== userId) {
      throw new ForbiddenError("Session does not belong to the user");
    }

    await this.sessionsRepository.deleteSession(userId, deviceId);
  }

  async deleteAllUsersSessions(
    userId: string,
    deviceId: string,
  ): Promise<void> {
    await this.sessionsRepository.deleteAllSessions(userId, deviceId);
  }

  async recoverPassword(email: string): Promise<void> {
    const user = await this.usersRepository.getUserByLoginOrEmail(email);

    if (!user) return;

    const recoveryCode = this.tokenService.createRandomCode();
    const expDate = this.dateService.addHours(2);

    await this.usersRepository.updateRecoveryCode(email, recoveryCode, expDate);

    this.emailService
      .sendPasswordRecoveryEmail(email, recoveryCode)
      .catch((err) => {
        console.log("password recovery", err);
      });
  }

  async updatePassword(
    newPassword: string,
    recoveryCode: string,
  ): Promise<void> {
    const user =
      await this.usersRepository.getUserByRecoveryCodeOrFail(recoveryCode);

    if (user.passwordRecovery.expDate < new Date()) {
      throw new BadRequestError("Recovery code is already expired");
    }

    const passwordHash = await this.passwordService.generateHash(newPassword);

    await this.usersRepository.updatePasswordHash(user._id, passwordHash);
  }

  async _checkUnique(login: string, email: string): Promise<void> {
    const existingUser = await this.usersRepository.getExistingUser(
      login,
      email,
    );

    if (existingUser) {
      const field =
        existingUser.accountData.email === email ? "email" : "login";

      throw new NotUniqueUserError(field);
    }
  }
}
