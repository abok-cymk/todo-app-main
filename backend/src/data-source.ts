import "reflect-metadata";
import { DataSource } from "typeorm";
import { Todo } from "./entities/Todo";

// Only load dotenv in development
if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config();
}

console.log("Environment check:", {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL ? "✓ Set" : "✗ Missing",
});

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // Use DATABASE_URL if available
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
  port: process.env.DATABASE_URL
    ? undefined
    : parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DATABASE_URL ? undefined : process.env.DB_USERNAME,
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
  database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  synchronize: true,
  logging: process.env.NODE_ENV !== "production",
  entities: [Todo],
  subscribers: [],
  migrations: [],
});
