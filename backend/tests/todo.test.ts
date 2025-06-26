import { describe, it, expect } from "vitest";
import {
  createTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
} from "../src/controllers/todo";
import { Request, Response } from "express";

describe("Todo Controller", () => {
  it("should create a new todo", async () => {
    const req = { body: { title: "Test Todo" } } as Request;
    let responseData: any;
    let statusCode: number = 0;

    const res = {
      status: (code: number) => ({
        json: (data: any) => {
          statusCode = code;
          responseData = data;
          return { statusCode: code, ...data };
        },
      }),
      json: (data: any) => {
        responseData = data;
        return data;
      },
    } as unknown as Response;

    await createTodo(req, res);
    expect(statusCode).toBe(201);
    expect(responseData.title).toBe("Test Todo");
    expect(responseData.completed).toBe(false);
  });

  it("should get all todos", async () => {
    const req = { query: {} } as Request;
    let responseData: any;

    const res = {
      json: (data: any) => {
        responseData = data;
        return data;
      },
    } as unknown as Response;

    await getAllTodos(req, res);
    expect(Array.isArray(responseData)).toBe(true);
  });

  it("should update a todo", async () => {
    // First create a todo
    const createReq = { body: { title: "To Update" } } as Request;
    let createdTodo: any;

    const createRes = {
      status: (code: number) => ({
        json: (data: any) => {
          createdTodo = data;
          return data;
        },
      }),
      json: (data: any) => {
        createdTodo = data;
        return data;
      },
    } as unknown as Response;

    await createTodo(createReq, createRes);

    // Now update it
    const updateReq = {
      params: { id: createdTodo.id.toString() },
      body: { completed: true },
    } as unknown as Request;

    let updatedTodo: any;
    const updateRes = {
      json: (data: any) => {
        updatedTodo = data;
        return data;
      },
    } as unknown as Response;

    await updateTodo(updateReq, updateRes);
    expect(updatedTodo.completed).toBe(true);
  });

  it("should delete a todo", async () => {
    // First create a todo
    const createReq = { body: { title: "To Delete" } } as Request;
    let createdTodo: any;

    const createRes = {
      status: (code: number) => ({
        json: (data: any) => {
          createdTodo = data;
          return data;
        },
      }),
      json: (data: any) => {
        createdTodo = data;
        return data;
      },
    } as unknown as Response;

    await createTodo(createReq, createRes);

    // Now delete it
    const deleteReq = {
      params: { id: createdTodo.id.toString() },
      query: {},
    } as unknown as Request;

    let statusCode: number = 0;
    const deleteRes = {
      status: (code: number) => ({
        send: () => {
          statusCode = code;
          return { statusCode: code };
        },
      }),
      send: () => {
        statusCode = 204;
        return { statusCode: 204 };
      },
    } as unknown as Response;

    await deleteTodo(deleteReq, deleteRes);
    expect(statusCode).toBe(204);
  });
});
