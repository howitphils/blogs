import { sessionsCollection } from "../../db/mongodb";
import { SessionDbModel } from "../types/sessions-types";
import { ServerError } from "../../core/middlewares/error-handling/custom-errors/server-error";
import { NotFoundError } from "../../core/middlewares/error-handling/custom-errors/not-found-error";

export const sessionsRepository = {
  async createSession(session: SessionDbModel): Promise<string> {
    const { insertedId } = await sessionsCollection.insertOne(session);

    return insertedId.toString();
  },

  async deleteSession(userId: string, deviceId: string) {
    const deleteResult = await sessionsCollection.deleteOne({
      userId,
      deviceId,
    });

    if (deleteResult.deletedCount !== 0) {
      throw new ServerError("Session was not deleted");
    }
  },

  async deleteAllSessions(userId: string, deviceId: string) {
    const deleteResult = await sessionsCollection.deleteMany({
      $and: [{ userId: { $ne: userId } }, { deviceId: { $ne: deviceId } }],
    });

    return deleteResult.deletedCount !== 0;
  },

  async getSessionByDeviceIdOrFail(deviceId: string): Promise<SessionDbModel> {
    const session = await sessionsCollection.findOne({
      deviceId,
    });

    if (!session) {
      throw new NotFoundError("Session was not found");
    }

    return session;
  },

  async updateSessionIatAndExp(
    deviceId: string,
    iat: number,
    exp: number,
  ): Promise<void> {
    const updateResult = await sessionsCollection.updateOne(
      { deviceId },
      { $set: { iat, exp } },
    );

    if (updateResult.modifiedCount === 0) {
      throw new ServerError("Session was not updated");
    }
  },
};
