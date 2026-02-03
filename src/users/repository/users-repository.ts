import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongodb";
import { UserDbModel } from "../types/users-types";
import { safeRegex } from "../utils/safe-regex";

export const usersRepository = {
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

  async getUniqueUser(login: string, email: string) {
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
