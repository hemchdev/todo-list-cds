'use client';

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  TextInput,
  Button,
  Search,
  Checkbox,
  Modal,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  IconButton,
} from '@carbon/react';
import { Add, Edit, TrashCan } from '@carbon/icons-react';
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

import styles from './TodoList.module.scss';

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todos, searchQuery } = useAppSelector((state: RootState) => state.todos);
  
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [editingTodo, setEditingTodo] = useState<{ id: string; text: string; description: string } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Initialize todos from localStorage on component mount
  useEffect(() => {
    dispatch(initializeTodos());
  }, [dispatch]);

  // Filter todos based on search query
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

  const handleEditTodo = (id: string, text: string, description: string) => {
    setEditingTodo({ id, text, description });
    setIsEditModalOpen(true);
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };


  return (
    <Grid className={styles['todo-grid']}>
      <Column lg={12} md={8} sm={4} className={styles['todo-column']}>
        <div className={styles['todo-container']}>
          <h1 className={styles['todo-title']}>
            Todo List
          </h1>
          
          {/* Add Todo Section */}
          <div className={styles['add-todo-section']}>
            <Grid className={styles['add-todo-grid']}>
              <Column lg={6} md={4} sm={2}>
                <TextInput
                  id="new-todo"
                  labelText="Todo Title"
                  placeholder="Enter todo title..."
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                />
              </Column>
              <Column lg={4} md={3} sm={1}>
                <TextInput
                  id="new-todo-description"
                  labelText="Description"
                  placeholder="Enter description..."
                  value={newTodoDescription}
                  onChange={(e) => setNewTodoDescription(e.target.value)}
                />
              </Column>
              <Column lg={2} md={1} sm={1} className={styles['add-todo-button-column']}>
                <Button
                  kind="primary"
                  renderIcon={Add}
                  onClick={handleAddTodo}
                  disabled={!newTodoText.trim()}
                  size="md"
                >
                  Add
                </Button>
              </Column>
            </Grid>
          </div>

          {/* Search Section */}
          <div className={styles['search-section']}>
            <Search
              id="todo-search"
              labelText="Search todos"
              placeholder="Search todos..."
              value={searchQuery}
              onChange={handleSearchChange}
              size="lg"
            />
          </div>

          {/* Todo List */}
          <div className={styles['todo-list-section']}>
            {filteredTodos.length === 0 ? (
              <div className={styles['empty-state']}>
                {todos.length === 0 ? 'No todos yet. Add one above!' : 'No todos match your search.'}
              </div>
            ) : (
              <StructuredListWrapper>
                <StructuredListHead>
                  <StructuredListRow head>
                    <StructuredListCell head style={{ width: '80px' }}>Status</StructuredListCell>
                    <StructuredListCell head style={{ width: 'auto' }}>Todo No</StructuredListCell>
                    <StructuredListCell head style={{ width: 'auto' }}>Todo</StructuredListCell>
                    <StructuredListCell head style={{ width: 'auto' }}>Description</StructuredListCell>
                    <StructuredListCell head style={{ width: '100px', textAlign: 'center' }}>Actions</StructuredListCell>
                  </StructuredListRow>
                </StructuredListHead>
                <StructuredListBody>
                  {filteredTodos.map((todo: Todo) => (
                    <StructuredListRow key={todo.id}>
                      <StructuredListCell style={{ width: '50px' }}>
                        <Checkbox
                          id={`checkbox-${todo.id}`}
                          checked={todo.completed}
                          onChange={() => handleToggleTodo(todo.id)}
                          labelText=""
                        />
                      </StructuredListCell>
                      <StructuredListCell style={{ width: '70px', textAlign: 'center' }}>
                        <span className={styles['todo-number']}>
                          {todo.todoNo}
                        </span>
                      </StructuredListCell>
                      <StructuredListCell style={{ width: 'auto' }}>
                        <span
                          className={todo.completed ? styles['todo-text--completed'] : styles['todo-text--active']}
                        >
                          {todo.text}
                        </span>
                      </StructuredListCell>
                      <StructuredListCell style={{ width: 'auto' }}>
                        <span
                          className={todo.completed ? styles['todo-text--completed'] : styles['todo-text--active']}
                        >
                          {todo.description || 'No description'}
                        </span>
                      </StructuredListCell>
                      <StructuredListCell style={{ width: '100px', textAlign: 'center' }}>
                        <div className={styles['action-buttons']}>
                          <IconButton
                            kind="ghost"
                            size="sm"
                            label="Edit"
                            onClick={() => handleEditTodo(todo.id, todo.text, todo.description)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            kind="ghost"
                            size="sm"
                            label="Delete"
                            onClick={() => handleDeleteTodo(todo.id)}
                          >
                            <TrashCan />
                          </IconButton>
                        </div>
                      </StructuredListCell>
                    </StructuredListRow>
                  ))}
                </StructuredListBody>
              </StructuredListWrapper>
            )}
          </div>

          {/* Summary */}
          <div className={styles['summary-section']}>
            <p className={styles['summary-text']}>
              Total: {todos.length} | 
              Active: {todos.filter((t: Todo) => !t.completed).length} | 
              Completed: {todos.filter((t: Todo) => t.completed).length}
              {searchQuery && ` | Showing: ${filteredTodos.length} matching "${searchQuery}"`}
            </p>
          </div>
        </div>
      </Column>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onRequestClose={handleCancelEdit}
        onRequestSubmit={handleSaveEdit}
        modalHeading="Edit Todo"
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        preventCloseOnClickOutside
      >
        <div style={{ marginBottom: '1rem' }}>
          <TextInput
            id="edit-todo-text"
            labelText="Todo title"
            value={editingTodo?.text || ''}
            onChange={(e) =>
              setEditingTodo(prev => prev ? { ...prev, text: e.target.value } : null)
            }
            
          />
        </div>
        <TextInput
          id="edit-todo-description"
          labelText="Description"
          value={editingTodo?.description || ''}
          onChange={(e) =>
            setEditingTodo(prev => prev ? { ...prev, description: e.target.value } : null)
          }
          
        />
      </Modal>
    </Grid>
  );
};

export default TodoList;
