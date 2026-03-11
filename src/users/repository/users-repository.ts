import { safeRegex } from "../utils/safe-regex";
import { UserNotFoundError } from "../application/errors/users-errors";
import { User } from "../application/classes/user";
import { injectable } from "inversify";
import { UserDbDocumentType } from "../types/users-types";
import { UserModel } from "./schemas/user/user-schema";

@injectable()
export class UsersRepository {
  // async save(user: UserDbDocumentType) {
  //   await user.save();
  // }

  async getUserByIdOrFail(id: string): Promise<Promise<UserDbDocumentType>> {
    return UserModel.findById(id).orFail(new UserNotFoundError());
  }

  async createUser(dto: User): Promise<string> {
    const user = await UserModel.insertOne(dto);

    return user.id;
  }

  async deleteUser(userId: string): Promise<void> {
    await UserModel.findByIdAndDelete(userId).orFail(new UserNotFoundError());
  }

  async getExistingUser(
    login: string,
    email: string,
  ): Promise<UserDbDocumentType | null> {
    return UserModel.findOne({
      $or: [
        {
          "accountData.login": {
            $regex: `^${safeRegex(login)}$`, // ^ - start of the string, $ - end of the string
            $options: "i",
          },
        },
        {
          "accountData.email": {
            $regex: `^${safeRegex(email)}$`,
            $options: "i",
          },
        },
      ],
    });
  }

  async getUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDbDocumentType | null> {
    return UserModel.findOne({
      $or: [
        {
          "accountData.login": {
            $regex: `^${safeRegex(loginOrEmail)}$`,
            $options: "i",
          },
        },
        {
          "accountData.email": {
            $regex: `^${safeRegex(loginOrEmail)}$`,
            $options: "i",
          },
        },
      ],
    });
  }

  async getUserByConfirmationCodeOrFail(
    code: string,
  ): Promise<UserDbDocumentType> {
    return UserModel.findOne({
      "emailConfirmation.confirmationCode": code,
    }).orFail(new UserNotFoundError());
  }

  async updateIsConfirmed(code: string): Promise<void> {
    await UserModel.updateOne(
      {
        "emailConfirmation.confirmationCode": code,
      },
      {
        $set: {
          "emailConfirmation.isConfirmed": true,
          "emailConfirmation.expDate": new Date(),
        },
      },
    ).orFail(new UserNotFoundError());
  }

  async updateConfirmationCodeAndExp(
    email: string,
    code: string,
    expDate: Date,
  ): Promise<void> {
    await UserModel.updateOne(
      {
        "accountData.email": email,
      },
      {
        "emailConfirmation.confirmationCode": code,
        "emailConfirmation.expDate": expDate,
      },
    ).orFail(new UserNotFoundError());
  }

  async updateRecoveryCode(
    email: string,
    recoveryCode: string,
    expDate: Date,
  ): Promise<void> {
    await UserModel.updateOne(
      {
        "accountData.email": email,
      },
      {
        "passwordRecovery.recoveryCode": recoveryCode,
        "passwordRecovery.expDate": expDate,
      },
    ).orFail(new UserNotFoundError());
  }

  async getUserByRecoveryCodeOrFail(
    recoveryCode: string,
  ): Promise<UserDbDocumentType> {
    return UserModel.findOne({
      "passwordRecovery.recoveryCode": recoveryCode,
    }).orFail(new UserNotFoundError());
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await UserModel.updateOne(
      {
        id,
      },
      {
        "accountData.passwordHash": passwordHash,
        "passwordRecovery.recoveryCode": null,
        "passwordRecovery.expDate": new Date(),
      },
    ).orFail(new UserNotFoundError());
  }
}
