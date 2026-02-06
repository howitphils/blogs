import { JwtPayload } from "jsonwebtoken";

export interface JwtPayloadWithUser extends JwtPayload {
  userId: string;
}
