'use client';

import React, { useState, useEffect } from 'react';
import { FlexGrid, Row, Column, Heading, Stack } from '@carbon/react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import {
  initializeTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodoText,
  setSearchQuery,
  Todo,
} from '../store/todoSlice';
import TodoInput from './TextInput';
import TodoSearch from './Search';
import TodoButton from './Button';
import TodoModal from './Modal';
import TodoDataTable from './DataTable';

const TodoList = () => {
  const dispatch = useAppDispatch();
  const { todos, searchQuery } = useAppSelector((state: RootState) => state.todos);
  
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [newTodoDescription, setNewTodoDescription] = useState<string>('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(initializeTodos());
  }, [dispatch]);

  const filteredTodos = todos.filter((todo: Todo) =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      dispatch(addTodo({ 
        text: newTodoText.trim(), 
        description: newTodoDescription.trim() 
      }));
      setNewTodoText('');
      setNewTodoDescription('');
    }
  };

  const handleToggleTodo = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const handleDeleteTodo = (id: string) => {
    dispatch(deleteTodo(id));
  };

  const handleEditTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      setEditingTodo(todo);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingTodo && editingTodo.text.trim()) {
      dispatch(updateTodoText({ 
        id: editingTodo.id, 
        text: editingTodo.text.trim(),
        description: editingTodo.description.trim()
      }));
      setIsEditModalOpen(false);
      setEditingTodo(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingTodo(null);
  };

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  return (
    <FlexGrid>
      <Row>
        <Column sm={4} md={6} lg={12} xlg={10} max={8} className="cds--offset-lg-2 cds--offset-xlg-3 cds--offset-max-4">
          <Stack gap={7}>
            <Heading>Todo List</Heading>
            
            <TodoSearch
              value={searchQuery}
              onChange={handleSearchChange}
            />
            
            <Row>
              <Column sm={4} md={3} lg={5}>
                <TodoInput
                  id="new-todo"
                  labelText="Todo Title"
                  placeholder="Enter todo title..."
                  value={newTodoText}
                  onChange={setNewTodoText}
                />
              </Column>
              <Column sm={4} md={3} lg={4}>
                <TodoInput
                  id="new-todo-description"
                  labelText="Description"
                  placeholder="Enter description..."
                  value={newTodoDescription}
                  onChange={setNewTodoDescription}
                />
              </Column>
              <Column sm={4} md={2} lg={3}>
                <div className="cds--form-item">
                  <div className="cds--label">&nbsp;</div>
                  <TodoButton
                    variant="add"
                    onClick={handleAddTodo}
                    disabled={!newTodoText.trim()}
                  />
                </div>
              </Column>
            </Row>

            <TodoDataTable
              todos={filteredTodos}
              onToggle={handleToggleTodo}
              onEdit={handleEditTodo}
              onDelete={handleDeleteTodo}
              totalTodos={todos.length}
              searchQuery={searchQuery}
            />

            <div>
              Total: {todos.length} | 
              Active: {todos.filter((t: Todo) => !t.completed).length} | 
              Completed: {todos.filter((t: Todo) => t.completed).length}
            </div>
          </Stack>
        </Column>
      </Row>

      <TodoModal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        onSave={handleSaveEdit}
        todoText={editingTodo?.text || ''}
        todoDescription={editingTodo?.description || ''}
        onTextChange={(value) =>
          setEditingTodo(prev => prev ? { ...prev, text: value } : null)
        }
        onDescriptionChange={(value) =>
          setEditingTodo(prev => prev ? { ...prev, description: value } : null)
        }
      />
    </FlexGrid>
  );
};

export default TodoList;
