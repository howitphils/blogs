import { Schema } from "mongoose";

export const PasswordRecoverySchema = new Schema(
  {
    recoveryCode: { type: String, default: null },
    expDate: { type: Date, required: true },
  },
  { _id: false },
);
