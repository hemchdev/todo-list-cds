'use client';

import React from 'react';
import { TextInput } from '@carbon/react';

type TodoInputProps = {
  id: string;
  labelText: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

const TodoInput: React.FC<TodoInputProps> = ({
  id,
  labelText,
  placeholder,
  value,
  onChange
}) => {
  return (
    <TextInput
      id={id}
      labelText={labelText}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default TodoInput;
