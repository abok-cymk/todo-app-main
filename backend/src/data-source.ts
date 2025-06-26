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
  DB_HOST: process.env.DB_HOST || "Not set",
});

// Validate that we have a database connection
if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
  console.error("❌ No database configuration found!");
  console.error("Set either DATABASE_URL or individual DB_* variables");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, // Use DATABASE_URL if available
  host: process.env.DATABASE_URL
    ? undefined
    : process.env.DB_HOST || "localhost",
  port: process.env.DATABASE_URL
    ? undefined
    : parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DATABASE_URL
    ? undefined
    : process.env.DB_USERNAME || "postgres",
  password: process.env.DATABASE_URL
    ? undefined
    : process.env.DB_PASSWORD || "root",
  database: process.env.DATABASE_URL
    ? undefined
    : process.env.DB_NAME || "todo_app",
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
