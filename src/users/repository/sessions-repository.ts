import { SessionDbDocument, SessionDbModel } from "../types/sessions-types";
import { injectable } from "inversify";
import { SessionModel } from "./schemas/sessions/session-schema";
import { SessionNotFoundError } from "../application/errors/session-errors";

@injectable()
export class SessionsRepository {
  async createSession(dto: SessionDbModel): Promise<SessionDbDocument> {
    return SessionModel.insertOne(dto);
  }

  async deleteSession(
    userId: string,
    deviceId: string,
  ): Promise<SessionDbDocument> {
    return SessionModel.findOneAndDelete({
      userId,
      deviceId,
    }).orFail(new SessionNotFoundError());
  }

  async deleteAllSessions(userId: string, deviceId: string) {
    await SessionModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
  }

  async getSessionByDeviceIdOrFail(
    deviceId: string,
  ): Promise<SessionDbDocument> {
    return SessionModel.findOne({
      deviceId,
    }).orFail(new SessionNotFoundError());
  }

  async updateSessionIatAndExp(
    deviceId: string,
    iat: number,
    exp: number,
  ): Promise<SessionDbDocument> {
    return SessionModel.findOneAndUpdate({ deviceId }, { iat, exp }).orFail(
      new SessionNotFoundError(),
    );
  }
}
