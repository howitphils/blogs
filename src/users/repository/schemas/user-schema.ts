import mongoose from "mongoose";
import { User } from "../../application/classes/user";

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

export const EmailConfirmationSchema = new mongoose.Schema(
  {
    confirmationCode: { type: String, required: true },
    expDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
  { _id: false },
);

export const PasswordRecoverySchema = new mongoose.Schema(
  {
    recoveryCode: { type: String, required: true, default: null },
    expDate: { type: Date, required: true },
  },
  { _id: false },
);

const UserSchema = new mongoose.Schema({
  accountData: { type: AccountDataSchema, required: true },
  emailConfirmation: { type: EmailConfirmationSchema, required: true },
  passwordRecovery: { type: PasswordRecoverySchema, required: true },
});

export const UserModel = mongoose.model("User", UserSchema);

export type UserDbDocumentType = mongoose.HydratedDocument<User>;
