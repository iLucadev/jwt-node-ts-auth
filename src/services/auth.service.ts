// auth.service.ts

import { CreateUserDto } from "../domain/dtos/createUser.dto";
import { LoginUserDto } from "../domain/dtos/loginUser.dto";
import { TokenService } from "./token.service";
import { PasswordService } from "./password.service";
import { UserService } from "./user.service";
import { RedisService } from "./redis.service";
import { injectable, inject } from "inversify";
import { IUserRepository, IUserRepositorySymbol } from "../repositories/abstract/iuser.repository";
import {
  InvalidCredentialsException,
  InvalidRefreshTokenException,
  UserCreationFailedException,
  UserNotFoundException,
} from "../exceptions/user.exceptions";

@injectable()
export class AuthService {
  constructor(
    @inject(IUserRepositorySymbol) private userRepository: IUserRepository,
    @inject(UserService) private userService: UserService,
    @inject(RedisService) private redisService: RedisService,
    @inject(TokenService) private tokenService: TokenService,
    @inject(PasswordService) private passwordService: PasswordService
  ) {}

  async register(userData: CreateUserDto) {
    const user = await this.userService.createUser(userData);

    if (!user) {
      throw new UserCreationFailedException();
    }

    const tokens = await this.userService.signTokens(user);
    return tokens;
  }

  async login(loginData: LoginUserDto) {
    const user = await this.userService.findUserByEmail(loginData.email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const passwordMatch = await this.passwordService.comparePasswords(loginData.password, user.password);

    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }

    const tokens = await this.userService.signTokens(user);
    return tokens;
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = this.tokenService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new InvalidRefreshTokenException();
    }

    const user = await this.userService.findUserById(payload.userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    const newAccessToken = this.tokenService.generateAccessToken(user.id);
    const newRefreshToken = this.tokenService.generateRefreshToken(user.id);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string) {
    await this.redisService.delete(userId);
  }
}
