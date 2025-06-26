import React, { useEffect, useState } from 'react';
import { TodoProvider, useTodos } from './contexts/TodoContext';
import TodoList from './components/TodoList';
import TodoInput from './components/TodoInput';
import TodoFilter from './components/TodoFilter';
import HealthCheck from './components/HealthCheck';
import { Toaster } from 'react-hot-toast';

const baseImagePath = import.meta.env.BASE_URL;

const TodoApp: React.FC = () => {
    const { todos, clearCompleted } = useTodos();
    const [toggleTheme, setToggleTheme] = useState(() => {
        // Check localStorage first, then fallback to system preference
        const stored = localStorage.getItem('theme');
        if (stored) {
            return stored === 'dark';
        }
        // Fallback to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        // Update document class and localStorage
        if (toggleTheme) {
            document.documentElement.classList.add("dark");
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem('theme', 'light');
        }
    }, [toggleTheme]);

    // Count active (non-completed) todos
    const activeCount = todos.filter(todo => !todo.completed).length;

    const handleClearCompleted = () => {
        clearCompleted();
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 --bg-[url('/bg-mobile-dark.jpg')] --md:bg-[url('/bg-desktop-dark.jpg')] bg-no-repeat bg-cover">
            <div className="max-w-md mx-auto">
                <div className='flex items-center justify-between mb-8'>
                    <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">T O D O</h1>
                    <button
                        onClick={() => setToggleTheme((prev) => !prev)}
                        id="toggleDark"
                        aria-label="Toggle dark mode"
                        className="ml-auto"
                    >
                        {toggleTheme ? (
                            <img src={`${baseImagePath}/icon-sun.svg`}
                                className="text-slate-900 dark:text-yellow-500 cursor-pointer"
                                alt=''
                            />
                        ) : (
                            <img
                                src={`${baseImagePath}/icon-moon.svg`}
                                className="text-slate-900 dark:text-blue-600 cursor-pointer"
                                alt=''
                            />
                        )}
                    </button>
                </div>

                {/* Temporary debug component */}
                <HealthCheck />

                <div className="mb-6">
                    <TodoInput />
                </div>

                <div className="mb-4">
                    <TodoList />
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <span>{activeCount} {activeCount === 1 ? 'item' : 'items'} left</span>
                    <TodoFilter />
                    <button
                        onClick={handleClearCompleted}
                        className="hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        Clear Completed
                    </button>
                </div>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
                    Drag and drop to reorder list
                </p>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <TodoProvider>
            <TodoApp />
            <Toaster position="top-center" />
        </TodoProvider>
    );
};

export default App;