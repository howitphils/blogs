import { dateService } from "../../../core/services/date-service";
import { tokenService } from "../../../core/services/token-service";

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

  constructor(
    login: string,
    email: string,
    passwordHash: string,
    isConfirmed: boolean,
  ) {
    this.accountData = {
      login,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    this.emailConfirmation = {
      confirmationCode: tokenService.createRandomCode(),
      expDate: dateService.addHours(2),
      isConfirmed,
    };
    this.passwordRecovery = {
      recoveryCode: null,
      expDate: new Date(),
    };
  }
}
