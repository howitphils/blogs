import { ObjectId, WithId } from "mongodb";
import { usersCollection } from "../../db/mongodb";
import { UserDbModel } from "../types/users-types";
import { safeRegex } from "../utils/safe-regex";
import { UserNotFoundError } from "../application/errors/users-errors";
import { ServerError } from "../../core/middlewares/error-handling/custom-errors/server-error";

export const usersRepository = {
  async getUserByIdOrFail(id: string): Promise<WithId<UserDbModel>> {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  },

  async createUser(userDto: UserDbModel): Promise<string> {
    const { insertedId } = await usersCollection.insertOne(userDto);

    return insertedId.toString();
  },

  async deleteUser(userId: string): Promise<boolean> {
    const deleteResult = await usersCollection.deleteOne({
      _id: new ObjectId(userId),
    });

    return deleteResult.deletedCount !== 0;
  },

  async getExistingUser(
    login: string,
    email: string,
  ): Promise<WithId<UserDbModel> | null> {
    return usersCollection.findOne({
      $or: [
        {
          "accountData.login": {
            $regex: `^${safeRegex(login)}$`,
            $options: "i",
          }, // ^ - start of the string, $ - end of the string
        },
        {
          "accountData.email": {
            $regex: `^${safeRegex(email)}$`,
            $options: "i",
          },
        },
      ],
    });
  },

  async getUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<WithId<UserDbModel> | null> {
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
  },

  async getUserByConfirmationCode(
    code: string,
  ): Promise<WithId<UserDbModel> | null> {
    return usersCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
  },

  async updateIsConfirmed(code: string): Promise<boolean> {
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

    return updateResult.matchedCount !== 0;
  },

  async updateConfirmationCodeAndExp(
    email: string,
    code: string,
    expDate: Date,
  ): Promise<boolean> {
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

    return updateResult.matchedCount !== 0;
  },

  async updateTokenInfo(userId: string, iat: number) {
    const updateResult = await usersCollection.updateOne(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: {
          "tokenInfo.issuedAt": iat,
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      throw new ServerError("Token info was not updated");
    }
  },
};
