import { AppDataSource } from "../data-source";
import { Todo } from "../entities/Todo";
import { CronJob } from "cron";
import { LessThan } from "typeorm";

export function setupTodoCleanup() {
  // Run every day at midnight
  new CronJob(
    "0 0 * * *",
    async () => {
      try {
        const todoRepository = AppDataSource.getRepository(Todo);
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

        await todoRepository.delete({
          trashed: true,
          deletedAt: LessThan(fifteenDaysAgo),
        });

        console.log("Cleaned up old trashed todos");
      } catch (error) {
        console.error("Error cleaning up todos:", error);
      }
    },
    null,
    true,
    "UTC"
  );
}
