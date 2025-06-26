import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Todo } from '../types';

// API Base URL - use environment variable in production
const API_BASE_URL = import.meta.env.PROD 
    ? 'https://todo-backend-1xzvyrxrt-allan-aboks-projects.vercel.app'
    : '';

interface TodoContextType {
    todos: Todo[];
    loading: boolean;
    error: string | null;
    filter: 'all' | 'active' | 'completed';
    addTodo: (title: string) => Promise<void>;
    toggleTodo: (id: number) => Promise<void>;
    deleteTodo: (id: number, permanent?: boolean) => Promise<void>;
    trashTodo: (id: number) => Promise<void>;
    clearCompleted: (permanent?: boolean) => Promise<void>;
    reorderTodos: (reorderData: {id: number, position: number}[], updatedTodos: Todo[]) => Promise<void>;
    setFilter: (filter: 'all' | 'active' | 'completed') => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    useEffect(() => {
        fetchTodos();
    }, [filter]);

    const fetchTodos = async () => {
        try {
            setLoading(true);
            console.log('Fetching todos from:', `${API_BASE_URL}/api/todos?filter=${filter}`);
            
            const response = await fetch(`${API_BASE_URL}/api/todos?filter=${filter}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Fetched todos:', data);
            setTodos(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching todos:', err);
            setError(`Failed to fetch todos: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async (title: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
            });
            const newTodo = await response.json();
            setTodos([...todos, newTodo]);
            // Show toast notification
        } catch (err) {
            setError('Failed to add todo');
        }
    };

    const toggleTodo = async (id: number) => {
        try {
            const todo = todos.find(t => t.id === id);
            if (!todo) return;
            
            const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !todo.completed }),
            });
            const updatedTodo = await response.json();
            
            setTodos(todos.map(t => t.id === id ? updatedTodo : t));
        } catch (err) {
            setError('Failed to update todo');
        }
    };

    const deleteTodo = async (id: number, permanent = false) => {
        try {
            await fetch(`${API_BASE_URL}/api/todos/${id}?permanent=${permanent}`, {
                method: 'DELETE',
            });
            if (permanent) {
                setTodos(todos.filter(t => t.id !== id));
            } else {
                // In a real app, you might want to show trashed items in a separate view
                setTodos(todos.filter(t => t.id !== id));
            }
        } catch (err) {
            setError('Failed to delete todo');
        }
    };

    const trashTodo = async (id: number) => {
        try {
            await fetch(`${API_BASE_URL}/api/todos/${id}/trash`, {
                method: 'POST',
            });
            setTodos(todos.filter(t => t.id !== id));
            // Show toast that item will be permanently deleted in 15 days
        } catch (err) {
            setError('Failed to move todo to trash');
        }
    };

    const clearCompleted = async (permanent = false) => {
        try {
            await fetch(`${API_BASE_URL}/api/todos/clear-completed?permanent=${permanent}`, {
                method: 'POST',
            });
            setTodos(todos.filter(t => !t.completed));
        } catch (err) {
            setError('Failed to clear completed todos');
        }
    };

    const reorderTodos = async (reorderData: {id: number, position: number}[], updatedTodos: Todo[]) => {
        try {
            // Update local state immediately for better UX
            setTodos(updatedTodos);
            
            const response = await fetch(`${API_BASE_URL}/api/todos/reorder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ todos: reorderData }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to reorder todos');
            }
            
            setError(null);
        } catch (err) {
            setError('Failed to reorder todos');
            // Revert the local state on error
            fetchTodos();
        }
    };

    return (
        <TodoContext.Provider value={{
            todos,
            loading,
            error,
            filter,
            addTodo,
            toggleTodo,
            deleteTodo,
            trashTodo,
            clearCompleted,
            reorderTodos,
            setFilter,
        }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodos = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodos must be used within a TodoProvider');
    }
    return context;
};