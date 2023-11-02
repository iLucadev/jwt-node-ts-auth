// auth.controller.ts

import { NextFunction, Request, Response } from "express";
import { CookieOptions } from "express-serve-static-core";
import config from "config";
import { CreateUserDto } from "../domain/dtos/createUser.dto";
import { LoginUserDto } from "../domain/dtos/loginUser.dto";
import { AuthService } from "../services/auth.service";
import { injectable, inject } from "inversify";
import AppError from "../utils/appError";
import { RefreshTokenNotFoundException } from "../exceptions/user.exceptions";

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
};

if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(Date.now() + config.get<number>("refreshTokenExpiresIn") * 60 * 1000),
  maxAge: config.get<number>("refreshTokenExpiresIn") * 60 * 1000,
};

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  async registerUserHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: CreateUserDto = req.body;
      const user = await this.authService.register(userData);

      res.cookie("refreshToken", user.refresh_token, refreshTokenCookieOptions);
      res.cookie("accessToken", user.access_token, accessTokenCookieOptions);

      return res.status(201).json({
        status: "success",
        message: "Registration successful!",
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  async loginUserHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData: LoginUserDto = req.body;
      const { access_token, refresh_token } = await this.authService.login(loginData);

      res.cookie("refreshToken", refresh_token, refreshTokenCookieOptions);
      res.cookie("accessToken", access_token, accessTokenCookieOptions);

      return res.status(200).json({
        status: "success",
        message: "Login successful!",
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshAccessTokenHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return next(new RefreshTokenNotFoundException());
      }

      const { accessToken } = await this.authService.refreshToken(refreshToken);

      res.cookie("accessToken", accessToken, accessTokenCookieOptions);

      return res.status(200).json({
        status: "success",
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async logoutHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;

      await this.authService.logout(user.id);

      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");

      return res.status(200).json({
        status: "success",
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

// To review the use of catchasync

// catchAsync.util.ts

/* 
import { NextFunction, Request, Response } from "express";

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const catchAsync = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync; 

*/

// Using catchAsync middleware to handle errors inside controller
/* 

registerUserHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userData: CreateUserDto = req.body;
  const user = await this.authService.register(userData);

  res.cookie("refreshToken", user.refresh_token, refreshTokenCookieOptions);
  res.cookie("accessToken", user.access_token, accessTokenCookieOptions);

  return res.status(201).json({
    message: "Registration successful!",
    user,
  });
}); 

*/
