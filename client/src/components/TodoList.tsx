import React from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';
import TodoItem from './TodoItem';
import { useTodos } from '../contexts/TodoContext';

const TodoList: React.FC = () => {
    const { todos, loading, error, filter, reorderTodos } = useTodos();

    const handleDragEnd = (result: DropResult) => {
        console.log('Drag ended:', result);
        
        if (!result.destination) {
            console.log('No destination, exiting');
            return;
        }
        
        const startIndex = result.source.index;
        const endIndex = result.destination.index;
        
        if (startIndex === endIndex) {
            console.log('Same position, exiting');
            return;
        }
        
        console.log(`Moving from ${startIndex} to ${endIndex}`);
        
        const items = Array.from(todos);
        const [reorderedItem] = items.splice(startIndex, 1);
        items.splice(endIndex, 0, reorderedItem);
        
        // Update positions based on new order and create minimal payload
        const reorderedTodos = items.map((todo, index) => ({
            id: todo.id,
            position: index
        }));
        
        // Update local state immediately for better UX
        const updatedTodos = items.map((todo, index) => ({
            ...todo,
            position: index
        }));
        
        console.log('Reorder data:', reorderedTodos);
        console.log('Updated todos:', updatedTodos);
        
        reorderTodos(reorderedTodos, updatedTodos);
    };

    const getEmptyMessage = () => {
        switch (filter) {
            case 'active':
                return 'No active todos yet. Add one above!';
            case 'completed':
                return 'No completed todos yet. Add one above or mark as complete and view them here!';
            default:
                return 'No todos yet. Add one above!';
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="todo-list">
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow"
                        style={{
                            backgroundColor: snapshot.isDraggingOver ? '#f3f4f6' : undefined,
                        }}
                    >
                        {todos.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                {getEmptyMessage()}
                            </div>
                        ) : (
                            todos.map((todo, index) => (
                                <Draggable 
                                    key={`todo-${todo.id}`} 
                                    draggableId={`todo-${todo.id}`} 
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                ...provided.draggableProps.style,
                                                opacity: snapshot.isDragging ? 0.8 : 1,
                                            }}
                                        >
                                            <TodoItem todo={todo} />
                                        </div>
                                    )}
                                </Draggable>
                            ))
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default TodoList;