import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongodb";
import { UserDbModel } from "../types/users-types";

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
};
