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

  async getExistingUser(login: string, email: string) {
    return usersCollection.findOne({
      $or: [
        {
          login: { $regex: `^${safeRegex(login)}$`, $options: "i" }, // ^ - start of the string, $ - end of the string
        },
        { email: { $regex: `^${safeRegex(email)}$`, $options: "i" } },
      ],
    });
  },

  async getUserByLoginOrEmail(loginOrEmail: string) {
    return usersCollection.findOne({
      $or: [
        {
          login: { $regex: `^${safeRegex(loginOrEmail)}$`, $options: "i" },
        },
        { email: { $regex: `^${safeRegex(loginOrEmail)}$`, $options: "i" } },
      ],
    });
  },
};
