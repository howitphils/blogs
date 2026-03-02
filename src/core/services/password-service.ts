import { hash, verify } from "argon2";
import { injectable } from "inversify";

@injectable()
export class PasswordService {
  async generateHash(password: string): Promise<string> {
    return hash(password);
  }

  async verifyHash(hash: string, password: string): Promise<boolean> {
    return verify(hash, password);
  }
}
