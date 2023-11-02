import { Request, Response, NextFunction } from "express";
import { IUserService } from "../repositories/abstract/iuser.service";

export class UserController {
  private readonly userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  async getMeHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.user;

      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (err: any) {
      next(err);
    }
  }
}
