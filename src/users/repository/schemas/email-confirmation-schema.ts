import { Schema } from "mongoose";

export const EmailConfirmationSchema = new Schema(
  {
    confirmationCode: { type: String, required: true },
    expDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
  { _id: false },
);
