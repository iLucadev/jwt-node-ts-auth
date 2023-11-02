// index.ts

import dotenv from "dotenv";
dotenv.config();

validateEnv();

import config from "config";
import { App } from "./src/app";
import validateEnv from "./src/utils/validateEnv";

const PORT = config.get<number>("port");
async function startServer() {
  const app = new App();
  await app.start(PORT);
}

startServer().catch((error) => {
  console.error("Error while initializing server:", error);
});
