import "reflect-metadata";
import { beforeAll, afterAll, beforeEach } from "vitest";
import { AppDataSource } from "../src/data-source";

// Global test setup
beforeAll(async () => {
  // Initialize database connection
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

afterAll(async () => {
  // Clean up database connection
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

// Clean up data before each test
beforeEach(async () => {
  // Clear all tables between tests
  const entities = AppDataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.clear();
  }
});
