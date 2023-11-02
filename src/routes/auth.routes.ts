// auth.routes.ts

import { Router } from "express";
import { DeserializeUserMiddleware } from "../middlewares/deserializeUser.middleware";
import { AuthController } from "../controllers/auth.controller";
import { requireUser } from "../middlewares/requireUser.middleware";
import { injectable, inject } from "inversify";
import { createUserSchema, loginUserSchema } from "../domain/schemas/user.schema";
import { validate } from "../middlewares/validate.middleware";

@injectable()
export class AuthRoutes {
  router = Router();

  constructor(
    @inject(AuthController) private authController: AuthController,
    @inject(DeserializeUserMiddleware) private deserializeUserMiddleware: DeserializeUserMiddleware
  ) {
    this.configureRoutes();
  }

  configureRoutes() {
    // Register user
    this.router.post("/register", validate(createUserSchema), this.authController.registerUserHandler);

    // Login user
    this.router.post("/login", validate(loginUserSchema), this.authController.loginUserHandler);

    // Logout user
    this.router.post(
      "/logout",
      this.deserializeUserMiddleware.deserializeUser,
      requireUser,
      this.authController.logoutHandler
    );

    // Refresh access token
    this.router.post("/refresh-token", this.authController.refreshAccessTokenHandler);
  }
}

/*     // Forgot password
    this.router.post("/forgot-password", this.authController.forgotPasswordHandler.bind(this.authController));

    // Verify email
    this.router.post("/verify-email", this.authController.verifyEmailHandler.bind(this.authController));

    // Reset password
    this.router.post("/reset-password", this.authController.resetPasswordHandler.bind(this.authController)); */
