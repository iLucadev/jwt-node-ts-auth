// user.service.ts

import { User } from "../domain/entities/user.entity";
import { injectable, inject } from "inversify";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto } from "../domain/dtos/createUser.dto";
import { TokenService } from "./token.service";
import { RedisService } from "./redis.service";
import { IUserRepository, IUserRepositorySymbol } from "../repositories/abstract/iuser.repository";
import { UserCreationFailedException, UserNotFoundException } from "../exceptions/user.exceptions";
import logger from "../utils/logger";
import AppError from "../utils/appError";

@injectable()
export class UserService {
  constructor(
    @inject(IUserRepositorySymbol) private userRepository: IUserRepository,
    private tokenService: TokenService,
    private redisService: RedisService
  ) {}

  async findUserById(userId: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new UserNotFoundException();
      }
      return user;
    } catch (error) {
      logger.error("Error finding user by ID: ", error);
      throw new AppError(500, "Error finding user by ID");
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) {
        throw new UserNotFoundException();
      }
      return user;
    } catch (error) {
      logger.error("Error finding user by email: ", error);
      throw new AppError(500, "Error finding user by email");
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User | null> {
    try {
      const user = await this.userRepository.createUser(createUserDto);
      if (!user) {
        throw new UserCreationFailedException();
      }
      return user;
    } catch (error) {
      logger.error("Error creating user: ", error);
      throw new AppError(500, "Error creating user");
    }
  }

  public async signTokens(user: User) {
    // 1. Create Session
    await this.redisService.set(user.id, user);
    // 2. Create Access and Refresh tokens
    const access_token = this.tokenService.generateAccessToken(user.id);
    const refresh_token = this.tokenService.generateRefreshToken(user.id);
    return { access_token, refresh_token };
  }
}

/* 
  public async updateUser(userId: string, userData: UpdateUserDto) {
  // Find user by id
  const user = await this.userRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Update user fields
  user.name = userData.name ?? user.name;
  user.email = userData.email ?? user.email;

  if (userData.password) {
    user.password = await bcrypt.hash(userData.password, 12);
  }

  // Save updated user
  await this.userRepository.save(user);

  return new UserDto(user);
}

public async deleteUser(userId: string) {
  return this.userRepository.delete(userId);
} 
*/
