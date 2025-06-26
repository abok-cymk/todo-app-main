import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Todo } from "../entities/Todo";

export const getAllTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filter } = req.query;
    const todoRepository = AppDataSource.getRepository(Todo);

    let query = todoRepository
      .createQueryBuilder("todo")
      .where("todo.trashed = false")
      .orderBy("todo.position", "ASC");

    if (filter === "active") {
      query = query.andWhere("todo.completed = false");
    } else if (filter === "completed") {
      query = query.andWhere("todo.completed = true");
    }

    const todos = await query.getMany();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
};

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;
    if (!title) {
      res.status(400).json({ message: "Title is required" });
      return;
    }

    const todoRepository = AppDataSource.getRepository(Todo);
    const count = await todoRepository.count();

    const todo = new Todo();
    todo.title = title.trim();
    todo.position = count;

    const savedTodo = await todoRepository.save(todo);
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
};

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const todoRepository = AppDataSource.getRepository(Todo);
    const todo = await todoRepository.findOneBy({ id: parseInt(id) });

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    if (title !== undefined) {
      todo.title = title.trim();
    }

    if (completed !== undefined) {
      todo.completed = completed;
    }

    const updatedTodo = await todoRepository.save(todo);
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
};

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;

    const todoRepository = AppDataSource.getRepository(Todo);

    if (permanent === "true") {
      await todoRepository.delete(parseInt(id));
    } else {
      await todoRepository.update(parseInt(id), {
        trashed: true,
        deletedAt: new Date(),
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
};

export const trashTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const todoRepository = AppDataSource.getRepository(Todo);
    await todoRepository.update(parseInt(id), {
      trashed: true,
      deletedAt: new Date(),
    });

    res.status(200).json({ message: "Todo moved to trash" });
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
};

export const clearCompleted = async (req: Request, res: Response): Promise<void> => {
  try {
    const { permanent } = req.query;
    const todoRepository = AppDataSource.getRepository(Todo);

    if (permanent === "true") {
      await todoRepository.delete({ completed: true, trashed: false });
    } else {
      await todoRepository.update(
        { completed: true, trashed: false },
        { trashed: true, deletedAt: new Date() }
      );
    }

    res.status(200).json({ message: "Completed todos cleared" });
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
};

export const reorderTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { todos } = req.body;
    if (!todos || !Array.isArray(todos)) {
      res.status(400).json({ message: "Invalid todos array" });
      return;
    }

    const todoRepository = AppDataSource.getRepository(Todo);
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      for (const item of todos) {
        await transactionalEntityManager.update(
          Todo,
          { id: item.id },
          { position: item.position }
        );
      }
    });

    res.status(200).json({ message: "Todos reordered successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    });
  }
};
