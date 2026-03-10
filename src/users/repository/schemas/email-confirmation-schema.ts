import mongoose from "mongoose";

export const EmailConfirmationSchema = new mongoose.Schema(
  {
    confirmationCode: { type: String, required: true },
    expDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
  { _id: false },
);
