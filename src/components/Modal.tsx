'use client';

import React from 'react';
import { Modal, Stack } from '@carbon/react';
import TodoInput from './TextInput';

type TodoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  todoText: string;
  todoDescription: string;
  onTextChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
};

const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  todoText,
  todoDescription,
  onTextChange,
  onDescriptionChange
}) => {
  return (
    <Modal
      open={isOpen}
      onRequestClose={onClose}
      onRequestSubmit={onSave}
      modalHeading="Edit Todo"
      primaryButtonText="Save"
      secondaryButtonText="Cancel"
      preventCloseOnClickOutside
    >
      <Stack gap={5}>
        <TodoInput
          id="edit-todo-text"
          labelText="Todo title"
          placeholder="Enter todo title..."
          value={todoText}
          onChange={onTextChange}
        />
        <TodoInput
          id="edit-todo-description"
          labelText="Description"
          placeholder="Enter description..."
          value={todoDescription}
          onChange={onDescriptionChange}
        />
      </Stack>
    </Modal>
  );
};

export default TodoModal;
