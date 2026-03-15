import { BadRequestError } from "../../../core/middlewares/error-handling/custom-errors/bad-request-error";
import { UserModel } from "../../repository/schemas/user/user-schema";
import { UserDbDocumentType } from "../../types/users-types";

export class User {
  accountData: {
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;
  };
  emailConfirmation: {
    confirmationCode: string;
    expDate: Date;
    isConfirmed: boolean;
  };
  passwordRecovery: {
    recoveryCode: string | null;
    expDate: Date;
  };

  private constructor(
    login: string,
    email: string,
    passwordHash: string,
    confirmationCode: string,
    expDate: Date,
    isConfirmed: boolean,
  ) {
    this.accountData = {
      login,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    this.emailConfirmation = {
      confirmationCode,
      expDate,
      isConfirmed,
    };
    this.passwordRecovery = {
      recoveryCode: null,
      expDate: new Date(),
    };
  }

  static createUser(
    login: string,
    email: string,
    passwordHash: string,
    confirmationCode: string,
    expDate: Date,
    isConfirmed: boolean,
  ): UserDbDocumentType {
    return new UserModel(
      new User(
        login,
        email,
        passwordHash,
        confirmationCode,
        expDate,
        isConfirmed,
      ),
    );
  }

  confirmEmail() {
    if (this.emailConfirmation.isConfirmed) {
      throw new BadRequestError("Email is already confirmed");
    }

    if (this.emailConfirmation.expDate < new Date()) {
      throw new BadRequestError("Confirmation code is already expired");
    }

    this.emailConfirmation.isConfirmed = true;
    this.emailConfirmation.expDate = new Date();
  }

  updateConfirmationInfo(newCode: string, newExp: Date) {
    if (this.emailConfirmation.isConfirmed) {
      throw new BadRequestError("Email is already confirmed");
    }

    this.emailConfirmation.confirmationCode = newCode;
    this.emailConfirmation.expDate = newExp;
  }

  updatePasswordRecoveryInfo(newCode: string, newExp: Date) {
    if (!this.emailConfirmation.isConfirmed) {
      throw new BadRequestError("Email is not confirmed");
    }

    this.passwordRecovery.recoveryCode = newCode;
    this.passwordRecovery.expDate = newExp;
  }

  updatePasswordHash(newHash: string) {
    if (this.passwordRecovery.expDate < new Date()) {
      throw new BadRequestError("Recovery code is already expired");
    }

    this.accountData.passwordHash = newHash;
    this.passwordRecovery.recoveryCode = null;
    this.passwordRecovery.expDate = new Date();
  }
}
