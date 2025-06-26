import React from 'react';
import { useTodos } from '../contexts/TodoContext';

const TodoFilter: React.FC = () => {
    const { filter, setFilter } = useTodos();

    return (
        <div className="flex space-x-2">
            {(['all', 'active', 'completed'] as const).map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-2 py-1 rounded ${filter === f ? 'text-blue-500 font-medium' : 'hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
            ))}
        </div>
    );
};

export default TodoFilter;