// token.service.ts

import { injectable, inject } from "inversify";
import { JwtService } from "./jwt.service";
import { JwtPayload } from "jsonwebtoken";
import { InvalidAccessTokenException, InvalidRefreshTokenException } from "../exceptions/user.exceptions";

@injectable()
export class TokenService {
  constructor(@inject(JwtService) private jwtService: JwtService) {}

  public generateAccessToken(userId: string): string {
    const payload: JwtPayload = { sub: userId };
    return this.jwtService.signToken(payload, "accessTokenPrivateKey");
  }

  public generateRefreshToken(userId: string): string {
    const payload: JwtPayload = { sub: userId };
    return this.jwtService.signToken(payload, "refreshTokenPrivateKey");
  }

  public verifyAccessToken(token: string): JwtPayload | null {
    const decoded = this.jwtService.verifyToken(token, "accessTokenPublicKey");
    if (!decoded) {
      throw new InvalidAccessTokenException();
    }
    return decoded;
  }

  public verifyRefreshToken(token: string): JwtPayload | null {
    const decoded = this.jwtService.verifyToken(token, "refreshTokenPublicKey");
    if (!decoded) {
      throw new InvalidRefreshTokenException();
    }
    return decoded;
  }
}
