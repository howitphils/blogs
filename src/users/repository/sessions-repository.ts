import { SessionDbModel } from "../types/sessions-types";
import { ServerError } from "../../core/middlewares/error-handling/custom-errors/server-error";
import { NotFoundError } from "../../core/middlewares/error-handling/custom-errors/not-found-error";
import { injectable } from "inversify";
import { SessionModel } from "./schemas/sessions/session-schema";

@injectable()
export class SessionsRepository {
  async createSession(dto: SessionDbModel): Promise<void> {
    await SessionModel.insertOne(dto);
  }

  async deleteSession(userId: string, deviceId: string) {
    const deleteResult = await SessionModel.deleteOne({
      userId,
      deviceId,
    });

    if (deleteResult.deletedCount === 0) {
      throw new ServerError("Session was not deleted");
    }
  }

  async deleteAllSessions(userId: string, deviceId: string) {
    const deleteResult = await SessionModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });

    if (deleteResult.deletedCount === 0) {
      throw new ServerError("Sessions were not deleted");
    }
  }

  async getSessionByDeviceIdOrFail(deviceId: string): Promise<SessionDbModel> {
    const session = await SessionModel.findOne({
      deviceId,
    });

    if (!session) {
      throw new NotFoundError("Session was not found");
    }

    return session;
  }

  async updateSessionIatAndExp(
    deviceId: string,
    iat: number,
    exp: number,
  ): Promise<void> {
    const updateResult = await SessionModel.updateOne(
      { deviceId },
      { $set: { iat, exp } },
    );

    if (updateResult.matchedCount === 0) {
      throw new ServerError("Session was not updated");
    }
  }
}
