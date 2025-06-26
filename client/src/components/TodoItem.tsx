import React, { useState } from "react";
import type { Todo } from "../types";
import { useTodos } from "../contexts/TodoContext";

interface TodoItemProps {
  todo: Todo;
}

const baseImagePath = import.meta.env.BASE_URL;

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { toggleTodo, deleteTodo, trashTodo } = useTodos();

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleDelete = (permanent: boolean) => {
    setShowOptions(false);
    deleteTodo(todo.id, permanent);
  };

  const handleTrash = () => {
    setShowOptions(false);
    trashTodo(todo.id);
  };

  return (
    <div
      className="flex items-center py-3 px-4 border-b border-gray-200 dark:border-gray-700 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <label className="relative flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="sr-only"
        />
        <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed 
            ? 'bg-gradient-to-br from-blue-400 to-purple-500 border-transparent' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
        }`}>
          {todo.completed && (
            <img
              src={`${baseImagePath}/icon-check.svg`}
              alt="checked"
              className="w-3 h-3"
            />
          )}
        </span>
      </label>

      <span
        className={`ml-3 flex-1 ${
          todo.completed
            ? "line-through text-gray-400 dark:text-gray-500"
            : "text-gray-800 dark:text-gray-200"
        }`}
      >
        {todo.title}
      </span>

      {(isHovered || showOptions) && (
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>

          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
              <div className="py-1">
                {todo.completed && (
                  <>
                    <button
                      onClick={handleTrash}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Move to Trash
                    </button>
                    <button
                      onClick={() => handleDelete(true)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Delete Permanently
                    </button>
                  </>
                )}
                {!todo.completed && (
                  <button
                    onClick={() => handleDelete(false)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoItem;
