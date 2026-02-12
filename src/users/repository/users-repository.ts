import { ObjectId, WithId } from "mongodb";
import { usersCollection } from "../../db/mongodb";
import { UserDbModel } from "../types/users-types";
import { safeRegex } from "../utils/safe-regex";
import { UserNotFoundError } from "../application/errors/users-errors";

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

  async confirmEmail(code: string) {
    const updateResult = await usersCollection.updateOne(
      {
        "accountData.confirmationCode": code,
      },
      {
        $set: {
          "accountData.isConfirmed": true,
        },
      },
    );

    return updateResult.matchedCount !== 0;
  },

  async updateConfirmationCodeAndExp(
    email: string,
    code: string,
    expDate: Date,
  ) {
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
};
