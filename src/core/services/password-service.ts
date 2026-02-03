import { hash, verify } from "argon2";

export const passwordService = {
  async generateHash(password: string): Promise<string> {
    return hash(password);
  },

  async verifyHash(hash: string, password: string): Promise<boolean> {
    return verify(hash, password);
  },
};
