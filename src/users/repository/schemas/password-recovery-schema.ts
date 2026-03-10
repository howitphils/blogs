import mongoose from "mongoose";

export const PasswordRecoverySchema = new mongoose.Schema(
  {
    recoveryCode: { type: String, required: true, default: null },
    expDate: { type: Date, required: true },
  },
  { _id: false },
);
