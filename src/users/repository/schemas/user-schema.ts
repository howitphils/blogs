import { Schema, model, HydratedDocument } from "mongoose";
import { User } from "../../application/classes/user";

import { AccountDataSchema } from "./account-data-schema";
import { EmailConfirmationSchema } from "./email-confirmation-schema";
import { PasswordRecoverySchema } from "./password-recovery-schema";

export type UserDbDocumentType = HydratedDocument<User>;

const UserSchema = new Schema<User>({
  accountData: { type: AccountDataSchema, required: true },
  emailConfirmation: { type: EmailConfirmationSchema, required: true },
  passwordRecovery: { type: PasswordRecoverySchema, required: true },
});

export const UserModel = model("Users", UserSchema);
