// redis.service.ts

import { injectable, inject } from "inversify";
import { RedisConnection } from "../utils/connectRedis";
import { User } from "../domain/entities/user.entity";
import AppError from "../utils/appError";

@injectable()
export class RedisService {
  private client;

  constructor(@inject(RedisConnection) private redis: RedisConnection) {
    this.client = this.redis.getClient();
  }

  async get(key: string): Promise<User | null> {
    try {
      if (!key) {
        throw new AppError(400, "Key cannot be empty");
      }
      const data = await this.client.get(key);
      if (!data) {
        return null;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error("An error occurred when obtaining the Redis value:", error);
      throw new AppError(500, "Error obtaining Redis value");
    }
  }

  async set(key: string, value: User, expiration?: number): Promise<void> {
    try {
      if (!key) {
        throw new AppError(400, "Key cannot be empty");
      }
      const stringValue = JSON.stringify(value);

      const options = expiration ? { EX: expiration } : undefined;

      await this.client.set(key, stringValue, options);
    } catch (error) {
      console.error("An error occurred when setting the value in Redis:", error);
      throw new AppError(500, "Error setting value in Redis");
    }
  }

  async delete(key: string) {
    try {
      if (!key) {
        throw new AppError(400, "Key cannot be empty");
      }

      await this.client.del(key);
    } catch (error) {
      console.error("An error occurred while deleting the Redis value:", error);
      throw new AppError(500, "Error deleting value in Redis");
    }
  }
}
