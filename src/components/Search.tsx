'use client';

import React from 'react';
import { Search } from '@carbon/react';

type TodoSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const TodoSearch: React.FC<TodoSearchProps> = ({
  value,
  onChange,
  placeholder = "Search todos..."
}) => {
  return (
    <Search
      id="todo-search"
      labelText="Search todos"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="lg"
    />
  );
};

export default TodoSearch;
