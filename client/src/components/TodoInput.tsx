import React, { useState } from 'react';
import { useTodos } from '../contexts/TodoContext';
import toast from 'react-hot-toast';

const TodoInput: React.FC = () => {
    const [title, setTitle] = useState('');
    const { addTodo } = useTodos();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        
        try {
            await addTodo(title);
            setTitle('');
            toast.success('Todo added successfully');
        } catch (error) {
            toast.error('Failed to add todo');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Currently typing..."
                className="w-full py-4 pl-12 pr-4 rounded-lg shadow-md bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-4 top-4 w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600"></div>
        </form>
    );
};

export default TodoInput;