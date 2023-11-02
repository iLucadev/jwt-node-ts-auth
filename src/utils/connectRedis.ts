// connectRedis.ts

import { injectable } from "inversify";
import { createClient } from "redis";

@injectable()
export class RedisConnection {
  private redisClient;
  private redisUrl = "redis://localhost:6379";

  constructor() {
    this.redisClient = createClient({ url: this.redisUrl });
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const retryLimit = 5;
      let retryCount = 0;

      const connectWithRetry = () => {
        this.redisClient.on("error", (error) => {
          console.log(error);
          if (retryCount < retryLimit) {
            retryCount++;
            setTimeout(connectWithRetry, 5000);
          } else {
            reject(error);
          }
        });

        this.redisClient.on("ready", () => {
          console.log("Connected to Redis");
          resolve(this.redisClient);
        });
      };

      connectWithRetry();
    });
  }

  getClient() {
    return this.redisClient;
  }
}
