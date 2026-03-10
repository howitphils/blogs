import { ObjectId, WithId } from "mongodb";
import { safeRegex } from "../utils/safe-regex";
import { UserNotFoundError } from "../application/errors/users-errors";
import { User } from "../application/classes/user";
import { ServerError } from "../../core/middlewares/error-handling/custom-errors/server-error";
import { injectable } from "inversify";
import { UserDbDocumentType, UserModel } from "./schemas/user-schema";

@injectable()
export class UsersRepository {
  async save(user: UserDbDocumentType) {
    await user.save();
  }

  async getUserByIdOrFail(id: string): Promise<Promise<UserDbDocumentType>> {
    const user = await UserModel.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new ServerError("User was not deleted");
    }
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
    const user = await UserModel.findOne({
      "emailConfirmation.confirmationCode": code,
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  async updateIsConfirmed(code: string): Promise<void> {
    const updateResult = await UserModel.updateOne(
      {
        "emailConfirmation.confirmationCode": code,
      },
      {
        $set: {
          "emailConfirmation.isConfirmed": true,
          "emailConfirmation.expDate": new Date(),
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      throw new ServerError("Confirmation status was not updated");
    }
  }

  async updateConfirmationCodeAndExp(
    email: string,
    code: string,
    expDate: Date,
  ): Promise<void> {
    const updateResult = await UserModel.updateOne(
      {
        "accountData.email": email,
      },
      {
        $set: {
          "emailConfirmation.confirmationCode": code,
          "emailConfirmation.expDate": expDate,
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      throw new ServerError("Confirmation code was not updated");
    }
  }

  async updateRecoveryCode(
    email: string,
    recoveryCode: string,
    expDate: Date,
  ): Promise<void> {
    const updateResult = await UserModel.updateOne(
      {
        "accountData.email": email,
      },
      {
        $set: {
          "passwordRecovery.recoveryCode": recoveryCode,
          "passwordRecovery.expDate": expDate,
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      throw new ServerError("User's recovery code was not updated");
    }
  }

  async getUserByRecoveryCodeOrFail(
    recoveryCode: string,
  ): Promise<WithId<User>> {
    const user = await UserModel.findOne({
      "passwordRecovery.recoveryCode": recoveryCode,
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  async updatePasswordHash(
    userId: ObjectId,
    passwordHash: string,
  ): Promise<void> {
    const updateResult = await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          "accountData.passwordHash": passwordHash,
          "passwordRecovery.recoveryCode": null,
          "passwordRecovery.expDate": new Date(),
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      throw new ServerError("User's password was not updated");
    }
  }
}
