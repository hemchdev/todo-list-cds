'use client';

import React from 'react';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
  Stack,
  Checkbox,
} from '@carbon/react';
import { Todo } from '../store/todoSlice';
import TodoButton from './Button';

type TodoDataTableProps = {
  todos: Todo[];
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  totalTodos?: number;
  searchQuery?: string;
};

const TodoDataTable: React.FC<TodoDataTableProps> = ({
  todos,
  onToggle,
  onEdit,
  onDelete,
  totalTodos = 0,
  searchQuery = ''
}) => {
  const headers = [
    { key: 'toggle', header: '' },
    { key: 'todoNo', header: 'Todo No' },
    { key: 'text', header: 'Todo' },
    { key: 'description', header: 'Description' },
    { key: 'status', header: 'Status' },
    { key: 'actions', header: 'Actions' },
  ];

  const rows = todos.map((todo) => ({
    id: todo.id,
    toggle: todo.completed,
    todoNo: todo.todoNo,
    text: todo.text,
    description: todo.description || 'No description',
    status: todo.completed,
    actions: todo,
  }));

  return (
    <DataTable rows={rows} headers={headers}>
      {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableHeader {...getHeaderProps({ header })} key={header.key}>
                  {header.header}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length}>
                  <div className="cds--type-body-01 cds--layout--text-align-center cds--layout--color-text-secondary cds--layout--padding-05">
                    {totalTodos === 0 ? 'No todos yet. Add one above!' : `No todos match your search "${searchQuery}".`}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow {...getRowProps({ row })} key={row.id}>
                  <TableCell>
                    <Checkbox
                      id={`checkbox-${row.id}`}
                      checked={row.cells[0].value}
                      onChange={() => onToggle(row.id)}
                      labelText=""
                    />
                  </TableCell>
                  <TableCell>{row.cells[1].value}</TableCell>
                  <TableCell>
                    <span className={row.cells[0].value ? 'cds--type-body-01 cds--strikethrough cds--layout--color-text-secondary' : 'cds--type-body-01'}>
                      {row.cells[2].value}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={row.cells[0].value ? 'cds--type-body-01 cds--strikethrough cds--layout--color-text-secondary' : 'cds--type-body-01'}>
                      {row.cells[3].value}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Tag
                      type={row.cells[4].value ? 'green' : 'blue'}
                      size="sm"
                      onClick={() => onToggle(row.id)}
                      className="cds--tag--clickable"
                    >
                      {row.cells[4].value ? 'Completed' : 'Pending'}
                    </Tag>
                  </TableCell>
                  <TableCell>
                    <Stack orientation="horizontal" gap={1}>
                      <TodoButton
                        variant="edit"
                        onClick={() => {
                          const todo = row.cells[5].value as Todo;
                          onEdit(todo.id);
                        }}
                      />
                      <TodoButton
                        variant="delete"
                        onClick={() => onDelete(row.id)}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </DataTable>
  );
};

export default TodoDataTable;
