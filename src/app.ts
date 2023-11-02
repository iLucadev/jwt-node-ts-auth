import express, { NextFunction, Request, Response, Application, Express } from "express";
import config from "config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Container } from "inversify";
import { IUserRepository, IUserRepositorySymbol } from "./repositories/abstract/iuser.repository";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import AppError from "./utils/appError";
import { AuthService } from "./services/auth.service";
import { TokenService } from "./services/token.service";
import { PasswordService } from "./services/password.service";
import { RedisService } from "./services/redis.service";
import logger from "./utils/logger";
import { AuthRoutes } from "./routes/auth.routes";
import { DeserializeUserMiddleware } from "./middlewares/deserializeUser.middleware";

export class App {
  private readonly app: Express;
  private container: Container;

  constructor() {
    this.app = express();
    this.container = new Container();

    this.configureContainer();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private configureContainer() {
    this.container.bind<IUserRepository>(IUserRepositorySymbol).to(UserRepository);
    this.container.bind<UserService>(UserService).toSelf();
    this.container.bind<AuthService>(AuthService).toSelf();
    this.container.bind<TokenService>(TokenService).toSelf();
    this.container.bind<PasswordService>(PasswordService).toSelf();
    this.container.bind<RedisService>(RedisService).toSelf();
    this.container.bind<DeserializeUserMiddleware>(DeserializeUserMiddleware).toSelf();
    this.container.bind<AuthRoutes>(AuthRoutes).toSelf();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json({ limit: "10kb" }));
    this.app.use(cookieParser());
    this.app.use(cors({ origin: config.get<string>("origin"), credentials: true }));
    this.app.use(morgan("dev"));
  }

  private initializeRoutes(): void {
    const authRoutes = this.container.get(AuthRoutes);
    this.app.use("/auth", authRoutes.router);
    //this.app.use("/api/users", UserRoutes);
  }

  private initializeErrorHandling(): void {
    this.app.use((error: AppError, req: Request, res: Response, next: NextFunction): void => {
      error.status = error.status || "error";
      error.statusCode = error.statusCode || 500;

      // Log all errors, regardless of whether they are operational or not
      logger.error(`[${error.status}] ${error.message}`, { stack: error.stack });

      const message = error.isOperational ? error.message : "An error occurred"; // Use a generic message for non-operational errors

      res.status(error.statusCode).json({
        status: error.status,
        message,
      });
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server started on port: ${port}`);
    });
  }
}

/*   private initializeRoutes(): void {
    this.app.use("/api/auth", AuthRoutes);
    this.app.use("/api/users", UserRoutes);
  } */

/*   private initializeErrorHandling(): void {
    this.app.all("*", (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    this.app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
      error.status = error.status || "error";
      error.statusCode = error.statusCode || 500;

      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    });
  } */
