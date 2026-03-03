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
}
