import * as argon from "argon2";
import { Injectable } from "@nestjs/common";
import { randomBytes } from "crypto";

@Injectable()
export class PasswordService {
  async hashPassword(password: string) {
    const salt = randomBytes(8);
    const hash = await argon.hash(password, {
      hashLength: 64,
      parallelism: 2,
      type: 2,
      salt: salt,
    });
    return hash;
  }
  async compare(password: string, hash: string) {
    return await argon.verify(hash, password);
  }
}
