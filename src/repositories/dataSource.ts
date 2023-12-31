// datasource.ts

import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "config";

const databaseConfig = config.get<{
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}>("database");

export const AppDataSource = new DataSource({
  ...databaseConfig,
  type: "mysql",
  synchronize: false,
  logging: false,
  entities: ["src/entities/**/*.entity{.ts,.js}"],
  migrations: ["src/migrations/**/*{.ts,.js}"],
  subscribers: ["src/subscribers/**/*{.ts,.js}"],
});
