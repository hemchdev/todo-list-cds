'use client';

import React from 'react';
import { Button, IconButton } from '@carbon/react';
import { Add, Edit, TrashCan } from '@carbon/icons-react';

type TodoButtonProps = {
  variant: 'add' | 'edit' | 'delete';
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const TodoButton: React.FC<TodoButtonProps> = ({
  variant,
  onClick,
  disabled = false,
  size = 'md'
}) => {
  if (variant === 'add') {
    return (
      <Button
        kind="primary"
        renderIcon={Add}
        onClick={onClick}
        disabled={disabled}
        size={size}
        className="cds--btn--full-width"
      >
        Add
      </Button>
    );
  }

  if (variant === 'edit') {
    return (
      <IconButton
        kind="ghost"
        size="sm"
        label="Edit"
        onClick={onClick}
      >
        <Edit />
      </IconButton>
    );
  }

  return (
    <IconButton
      kind="ghost"
      size="sm"
      label="Delete"
      onClick={onClick}
    >
      <TrashCan />
    </IconButton>
  );
};

export default TodoButton;
