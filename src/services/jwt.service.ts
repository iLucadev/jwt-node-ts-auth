// jwt.service.ts

import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import config from "config";
import { injectable, inject } from "inversify";

@injectable()
export class JwtService {
  private getPrivateKey(keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey"): string {
    const privateKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");
    return privateKey;
  }

  private getPublicKey(keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"): string {
    const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");
    return publicKey;
  }

  public signToken(
    payload: object,
    keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
    options?: SignOptions
  ): string {
    const privateKey = this.getPrivateKey(keyName);
    return jwt.sign(payload, privateKey, {
      ...(options && options),
      algorithm: "RS256",
    });
  }

  public verifyToken<T>(
    token: string,
    keyName: "accessTokenPublicKey" | "refreshTokenPublicKey",
    options?: VerifyOptions
  ): T | null {
    try {
      const publicKey = this.getPublicKey(keyName);
      const decoded = jwt.verify(token, publicKey, options) as T;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
