import { ObjectId } from "mongodb";
import { sessionsCollection } from "../../db/mongodb";
import { SessionDbModel } from "../types/sessions-types";

export const sessionsRepository = {
  async createSession(session: SessionDbModel): Promise<string> {
    const { insertedId } = await sessionsCollection.insertOne(session);

    return insertedId.toString();
  },

  async deleteSession(id: string) {
    const deleteResult = await sessionsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    return deleteResult.deletedCount !== 0;
  },

  async deleteAllSessions(id: string) {
    const deleteResult = await sessionsCollection.deleteMany({
      _id: { $ne: new ObjectId(id) },
    });

    return deleteResult.deletedCount !== 0;
  },
};
