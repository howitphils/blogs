import { model, Schema } from "mongoose";
import { SessionDbModel } from "../../../types/sessions-types";

const sessionSchema = new Schema<SessionDbModel>({
  deviceName: { type: String, required: true, trim: true, minLength: 1 },
  deviceId: { type: String, required: true },
  userId: { type: String, required: true },
  exp: { type: Number, required: true },
  iat: { type: Number, required: true },
  ip: { type: String, required: true },
});

export const SessionModel = model("Sessions", sessionSchema);
