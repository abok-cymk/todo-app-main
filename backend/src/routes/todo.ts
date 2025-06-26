import { Router } from "express";
import * as todoController from "../controllers/todo";

const router = Router();

router.get("/", todoController.getAllTodos);
router.post("/", todoController.createTodo);
router.patch("/:id", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);
router.post("/:id/trash", todoController.trashTodo);
router.post("/clear-completed", todoController.clearCompleted);
router.post("/reorder", todoController.reorderTodos);

export default router;
