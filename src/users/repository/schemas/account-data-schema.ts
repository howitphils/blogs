import mongoose from "mongoose";

export const AccountDataSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true,
      minLength: 1,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: 1,
      maxLength: 100,
    },
    passwordHash: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { _id: false },
);
