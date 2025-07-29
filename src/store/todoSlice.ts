import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Todo = {
  id: string;
  todoNo: number;
  text: string;
  description: string;
  completed: boolean;
}

type TodoState = {
  todos: Todo[];
  searchQuery: string;
}

const initialState: TodoState = {
  todos: [],
  searchQuery: '',
};

// Load from localStorage
const loadFromLocalStorage = (): Todo[] => {
  if (typeof window !== 'undefined') {
    try {
      const savedTodos = localStorage.getItem('todos');
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
      return [];
    }
  }
  return [];
};

// Save to localStorage
const saveToLocalStorage = (todos: Todo[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    initializeTodos: (state) => {
      const loadedTodos = loadFromLocalStorage();
      // Ensure proper sequential numbering
      loadedTodos.forEach((todo, index) => {
        todo.todoNo = index + 1;
      });
      state.todos = loadedTodos;
    },
    addTodo: (state, action: PayloadAction<{ text: string; description: string }>) => {
      // Find the highest todoNo and increment by 1 to ensure uniqueness
      const maxTodoNo = state.todos.length > 0 ? Math.max(...state.todos.map(todo => todo.todoNo)) : 0;
      const newTodo: Todo = {
        id: Date.now().toString(),
        todoNo: maxTodoNo + 1,
        text: action.payload.text,
        description: action.payload.description,
        completed: false,
      };
      state.todos.push(newTodo);
      // Renumber all todos to maintain sequential order
      state.todos.forEach((todo, index) => {
        todo.todoNo = index + 1;
      });
      saveToLocalStorage(state.todos);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveToLocalStorage(state.todos);
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      // Renumber todos to maintain sequential order
      state.todos.forEach((todo, index) => {
        todo.todoNo = index + 1;
      });
      saveToLocalStorage(state.todos);
    },
    updateTodoText: (state, action: PayloadAction<{ id: string; text: string; description: string }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.text = action.payload.text;
        todo.description = action.payload.description;
        saveToLocalStorage(state.todos);
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  initializeTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodoText,
  setSearchQuery,
} = todoSlice.actions;

export default todoSlice.reducer;
