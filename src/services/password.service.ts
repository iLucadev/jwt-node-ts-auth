// password.service.ts

import { compare, hash } from "bcrypt";
import { injectable, inject } from "inversify";

@injectable()
export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await compare(plainPassword, hashedPassword);
  }
}
