// deserializeUser.middleware.ts

import { NextFunction, Request, Response } from "express";
import { RedisService } from "../services/redis.service";
import { TokenService } from "../services/token.service";
import { injectable, inject } from "inversify";
import { UserService } from "../services/user.service";
import AppError from "../utils/appError";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../domain/entities/user.entity";

@injectable()
export class DeserializeUserMiddleware {
  constructor(
    private tokenService: TokenService,
    private redisService: RedisService,
    private userService: UserService
  ) {}

  async deserializeUser(req: Request, res: Response, next: NextFunction) {
    try {
      let access_token;

      if (req.headers.authorization?.startsWith("Bearer")) {
        access_token = req.headers.authorization.split(" ")[1];
      } else if (req.cookies.access_token) {
        access_token = req.cookies.access_token;
      }

      if (!access_token) {
        return next(new AppError(401, "You are not logged in"));
      }

      // Validate the access token
      const decoded: JwtPayload | null = await this.tokenService.verifyAccessToken(access_token);

      if (!decoded) {
        return next(new AppError(401, `Invalid token or user doesn't exist`));
      }

      // Check if the user has a valid session
      const session: User | null = await this.redisService.get(decoded.sub ?? "");

      if (!session) {
        return next(new AppError(401, `Invalid token or session has expired`));
      }

      // Check if the user still exist
      const user = await this.userService.findUserById(session.id);

      if (!user) {
        return next(new AppError(401, `Invalid token or session has expired`));
      }

      // Add user to res.locals
      res.locals.user = user;

      next();
    } catch (err: any) {
      next(err);
    }
  }
}
