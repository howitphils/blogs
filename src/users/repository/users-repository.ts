import { ObjectId, WithId } from "mongodb";
import { usersCollection } from "../../db/mongodb";
import { safeRegex } from "../utils/safe-regex";
import { UserNotFoundError } from "../application/errors/users-errors";
import { User } from "../application/classes/user";
import { ServerError } from "../../core/middlewares/error-handling/custom-errors/server-error";
import { injectable } from "inversify";

@injectable()
export class UsersRepository {
  async getUserByIdOrFail(id: string): Promise<WithId<User>> {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  async createUser(userDto: User): Promise<string> {
    const { insertedId } = await usersCollection.insertOne(userDto);

    return insertedId.toString();
  }

  async deleteUser(userId: string): Promise<void> {
    const deleteResult = await usersCollection.deleteOne({
      _id: new ObjectId(userId),
    });

    if (deleteResult.deletedCount === 0) {
      throw new ServerError("User was not deleted");
    }
  }

  async getExistingUser(
    login: string,
    email: string,
  ): Promise<WithId<User> | null> {
    return usersCollection.findOne({
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
  ): Promise<WithId<User> | null> {
    return usersCollection.findOne({
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

  async getUserByConfirmationCodeOrFail(code: string): Promise<WithId<User>> {
    const user = await usersCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  async updateIsConfirmed(code: string): Promise<void> {
    const updateResult = await usersCollection.updateOne(
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
    const updateResult = await usersCollection.updateOne(
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
    const updateResult = await usersCollection.updateOne(
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
    const user = await usersCollection.findOne({
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
    const updateResult = await usersCollection.updateOne(
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
