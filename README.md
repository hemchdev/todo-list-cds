# Carbon Design Todo List - Project-Based Learning Guide

A comprehensive, step-by-step tutorial for building a professional Todo List application using Next.js, Redux Toolkit, TypeScript, and IBM Carbon Design System.

## 📚 What You'll Learn

This project will teach you:
- **Next.js 14** - Modern React framework with App Router
- **TypeScript** - Type-safe JavaScript development
- **Redux Toolkit** - Modern state management
- **IBM Carbon Design System** - Enterprise-grade UI components
- **SCSS/Sass** - Advanced CSS with variables and mixins
- **Local Storage** - Browser data persistence
- **Responsive Design** - Mobile-first development
- **Component Architecture** - Scalable React patterns

## 🎯 Project Overview

We're building a professional Todo List application with these features:
- ✅ **CRUD Operations** (Create, Read, Update, Delete)
- 🔍 **Real-time Search** with filtering
- 💾 **Local Storage Persistence** 
- 📱 **Responsive Design** for all devices
- 🎨 **Professional UI** with Carbon Design System
- 📊 **Todo Statistics** and summary
- 🔄 **State Management** with Redux Toolkit

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Basic knowledge of React and JavaScript
- Understanding of HTML/CSS

### Initial Setup

```bash
# Clone or create the project
npx create-next-app@latest carbon-todo-list --typescript --tailwind --eslint --app --src-dir
cd carbon-todo-list

# Install required dependencies
npm install @reduxjs/toolkit react-redux @carbon/react @carbon/icons-react nanoid sass
```

---

## 📖 Step-by-Step Tutorial

### Step 1: Project Structure Setup

#### Why This Structure?
We organize our code into logical folders to maintain scalability and readability.

```
src/
├── app/                 # Next.js App Router pages
│   ├── globals.scss     # Global styles with Carbon Design tokens
│   ├── layout.tsx       # Root layout with providers
│   └── page.tsx         # Home page component
├── components/          # Reusable UI components
│   ├── TodoList.tsx     # Main todo list component
│   └── TodoList.module.scss # Component-specific styles
└── store/              # Redux state management
    ├── index.ts        # Store configuration
    ├── hooks.ts        # Typed Redux hooks
    ├── todoSlice.ts    # Todo state slice
    └── ReduxProvider.tsx # Redux provider wrapper
```

#### What Each Folder Does:
- **`app/`**: Contains Next.js pages and routing logic
- **`components/`**: Reusable UI components with co-located styles
- **`store/`**: All Redux-related code for state management

---

### Step 2: Setting Up Global Styles with Carbon Design

#### File: `src/app/globals.scss`

```scss
@use '@carbon/react';
@use '@carbon/react/scss/spacing' as *;
@use '@carbon/react/scss/theme' as *;
@use '@carbon/react/scss/breakpoint' as *;
```

#### Why We Use These Imports:
- **`@use '@carbon/react'`**: Loads all Carbon CSS components
- **`spacing`**: Provides consistent spacing tokens ($spacing-01 to $spacing-13)
- **`theme`**: Gives us color tokens ($background, $text-primary, etc.)
- **`breakpoint`**: Responsive design mixins for different screen sizes

#### Key Global Styles Explained:

```scss
html {
  background-color: $background;  // Uses Carbon's background color token
}

body {
  background-color: $background;
  color: $text-primary;          // Uses Carbon's primary text color
  min-height: 100vh;             // Ensures full viewport height
  margin: 0;
  padding: 0;
}
```

#### Why These Styles:
- **Color Tokens**: Ensures consistent theming across the app
- **Full Height**: Makes the app fill the entire screen
- **Reset Margins**: Removes default browser spacing

---

### Step 3: Redux Store Configuration

#### File: `src/store/index.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### Why Redux Toolkit:
- **Simplified Setup**: Less boilerplate than traditional Redux
- **Built-in Best Practices**: Includes Redux DevTools, Thunk middleware
- **Type Safety**: Works seamlessly with TypeScript
- **Immutable Updates**: Uses Immer for safe state mutations

#### What Each Export Does:
- **`store`**: The main Redux store instance
- **`RootState`**: TypeScript type for the entire app state
- **`AppDispatch`**: TypeScript type for dispatch function

---

### Step 4: Creating Typed Redux Hooks

#### File: `src/store/hooks.ts`

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

#### Why Custom Hooks:
- **Type Safety**: Automatically infers correct types
- **Developer Experience**: Better autocomplete and error catching
- **Consistency**: Ensures all components use typed versions

---

### Step 5: Todo Data Model and State Management

#### File: `src/store/todoSlice.ts`

```typescript
export interface Todo {
  id: string;          // Unique identifier using nanoid
  todoNo: number;      // Sequential number for display
  text: string;        // Main todo title
  description: string; // Additional details
  completed: boolean;  // Completion status
}
```

#### Why This Structure:
- **`id`**: Unique identifier for React keys and operations
- **`todoNo`**: User-friendly numbering system
- **`text`**: Primary todo content
- **`description`**: Additional context (optional)
- **`completed`**: Track completion status

#### Local Storage Functions:

```typescript
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
```

#### Why This Pattern:
- **SSR Safety**: Checks for `window` to avoid server-side errors
- **Error Handling**: Graceful fallback if localStorage fails
- **Type Safety**: Returns proper Todo array type

---

### Step 6: Redux Actions and Reducers

#### Key Actions Explained:

```typescript
addTodo: (state, action: PayloadAction<{ text: string; description: string }>) => {
  const newTodo: Todo = {
    id: nanoid(),                    // Generate unique ID
    todoNo: state.todos.length + 1,  // Sequential numbering
    text: action.payload.text,
    description: action.payload.description,
    completed: false,
  };
  state.todos.push(newTodo);
  saveToLocalStorage(state.todos);   // Persist to localStorage
},
```

#### Why This Approach:
- **Immutable Updates**: Redux Toolkit uses Immer internally
- **Automatic Persistence**: Every change saves to localStorage
- **Predictable State**: All state changes go through Redux

---

### Step 7: Component Architecture

#### File: `src/components/TodoList.tsx`

#### Component Structure:
```typescript
const TodoList: React.FC = () => {
  // Redux state and dispatch
  const dispatch = useAppDispatch();
  const { todos, searchQuery } = useAppSelector((state: RootState) => state.todos);
  
  // Local component state
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [editingTodo, setEditingTodo] = useState<{ id: string; text: string; description: string } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
```

#### Why This State Structure:
- **Redux State**: For data that needs to persist and be shared
- **Local State**: For temporary UI state (form inputs, modal state)
- **Typed State**: TypeScript ensures type safety

---

### Step 8: Carbon Design System Implementation

#### Why Carbon Design System:
- **Enterprise Ready**: Used by IBM and many Fortune 500 companies
- **Accessibility**: Built-in WCAG compliance
- **Consistency**: Standardized design patterns
- **Components**: Pre-built, tested UI components

#### Key Components Used:

```typescript
import {
  Grid,           // Responsive layout system
  Column,         // Grid columns with breakpoints
  TextInput,      // Form input with validation
  Button,         // Various button styles
  Search,         // Search input with built-in functionality
  Checkbox,       // Accessible checkbox component
  Modal,          // Modal dialog with backdrop
  StructuredList, // Table-like data display
  IconButton,     // Icon-only buttons
} from '@carbon/react';
```

#### Grid System Example:
```typescript
<Grid className={styles['todo-grid']}>
  <Column lg={6} md={4} sm={2}>    {/* Responsive columns */}
    <TextInput ... />
  </Column>
  <Column lg={4} md={3} sm={1}>
    <TextInput ... />
  </Column>
  <Column lg={2} md={1} sm={1}>
    <Button ... />
  </Column>
</Grid>
```

#### Why This Grid System:
- **lg={6}**: Large screens (≥1056px) - 6/12 columns
- **md={4}**: Medium screens (≥672px) - 4/8 columns  
- **sm={2}**: Small screens (≥320px) - 2/4 columns

---

### Step 9: SCSS Module Architecture

#### File: `src/components/TodoList.module.scss`

```scss
@use '@carbon/react/scss/spacing' as *;
@use '@carbon/react/scss/theme' as *;
@use '@carbon/react/scss/type' as *;
@use '@carbon/react/scss/breakpoint' as *;
```

#### Why SCSS Modules:
- **Scoped Styles**: CSS classes are automatically scoped to components
- **No Conflicts**: Prevents CSS class name collisions
- **Carbon Integration**: Access to all Carbon design tokens

#### Key Styling Patterns:

```scss
.todo-container {
  padding: $spacing-06;              // Carbon spacing token
  background-color: $layer-01;       // Carbon background layer
  border-radius: 8px;
  width: 100%;
  max-width: 1000px;
  box-sizing: border-box;
  margin: 0 auto;                    // Center horizontally
  
  @include breakpoint(md) {          // Responsive styling
    padding: $spacing-07;
  }
}
```

#### Design Token Benefits:
- **Consistency**: All spacing follows 8px grid system
- **Theming**: Colors automatically adapt to light/dark themes
- **Maintenance**: Changes to tokens update entire app

---

### Step 10: Form Handling and User Interactions

#### Add Todo Form:
```typescript
const handleAddTodo = () => {
  if (newTodoText.trim()) {
    dispatch(addTodo({ 
      text: newTodoText.trim(), 
      description: newTodoDescription.trim() 
    }));
    setNewTodoText('');              // Clear form
    setNewTodoDescription('');
  }
};
```

#### Why This Pattern:
- **Validation**: Checks for non-empty text
- **Cleanup**: Automatically clears form after submission
- **Redux Integration**: Dispatches action to update global state

#### Edit Modal Implementation:
```typescript
const handleEditTodo = (id: string, text: string, description: string) => {
  setEditingTodo({ id, text, description });
  setIsEditModalOpen(true);
};
```

#### Modal Benefits:
- **Focus Management**: Carbon Modal handles accessibility
- **User Experience**: Non-destructive editing
- **Form Validation**: Built-in validation patterns

---

### Step 11: Search and Filtering

#### Real-time Search Implementation:
```typescript
const filteredTodos = todos.filter((todo: Todo) =>
  todo.text.toLowerCase().includes(searchQuery.toLowerCase())
);
```

#### Why This Approach:
- **Performance**: Filtering happens in memory (fast)
- **User Experience**: Instant results as user types
- **Case Insensitive**: More user-friendly searching

#### Search Component:
```typescript
<Search
  id="todo-search"
  labelText="Search todos"
  placeholder="Search todos..."
  value={searchQuery}
  onChange={handleSearchChange}
  size="lg"
/>
```

---

### Step 12: Data Table with Structured List

#### Table Structure:
```typescript
<StructuredListWrapper>
  <StructuredListHead>
    <StructuredListRow head>
      <StructuredListCell head style={{ width: '50px' }}>Status</StructuredListCell>
      <StructuredListCell head style={{ width: '70px' }}>Todo No</StructuredListCell>
      <StructuredListCell head style={{ width: 'auto' }}>Todo</StructuredListCell>
      <StructuredListCell head style={{ width: 'auto' }}>Description</StructuredListCell>
      <StructuredListCell head style={{ width: '100px' }}>Actions</StructuredListCell>
    </StructuredListRow>
  </StructuredListHead>
```

#### Column Design Decisions:
- **Status (50px)**: Just enough for checkbox
- **Todo No (70px)**: Fixed width for numbers
- **Todo (auto)**: Flexible, takes available space
- **Description (auto)**: Flexible, secondary content
- **Actions (100px)**: Fixed width for two icon buttons

---

### Step 13: Responsive Design Implementation

#### Mobile-First Approach:
```scss
.todo-container {
  padding: $spacing-06;              // Base mobile styling
  
  @include breakpoint(md) {          // Tablet and up
    padding: $spacing-07;
  }
  
  @include breakpoint(lg) {          // Desktop and up
    padding: $spacing-08;
  }
}
```

#### Why Mobile-First:
- **Performance**: Loads faster on mobile devices
- **Progressive Enhancement**: Adds features for larger screens
- **User Experience**: Optimized for most common use case

#### Grid Responsiveness:
```typescript
<Column lg={6} md={4} sm={2}>        // Todo title input
<Column lg={4} md={3} sm={1}>        // Description input
<Column lg={2} md={1} sm={1}>        // Add button
```

#### Screen Size Behavior:
- **Mobile**: Stacked layout, full-width inputs
- **Tablet**: Two-column layout
- **Desktop**: Three-column layout with optimal proportions

---

### Step 14: Accessibility Features

#### Built-in Accessibility:
```typescript
<IconButton
  kind="ghost"
  size="sm"
  label="Edit todo"                  // Screen reader label
  onClick={() => handleEditTodo(todo.id, todo.text, todo.description)}
>
  <Edit />
</IconButton>
```

#### Accessibility Benefits:
- **Screen Readers**: All buttons have descriptive labels
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Proper focus handling in modals
- **Color Contrast**: Carbon ensures WCAG compliance

---

### Step 15: Performance Optimizations

#### Why These Patterns Improve Performance:

1. **Local Storage Caching**:
   ```typescript
   useEffect(() => {
     dispatch(initializeTodos());     // Load once on mount
   }, [dispatch]);
   ```

2. **Efficient Filtering**:
   ```typescript
   const filteredTodos = todos.filter(/* filter logic */);  // Pure function
   ```

3. **Minimal Re-renders**:
   ```typescript
   const { todos, searchQuery } = useAppSelector((state: RootState) => state.todos);
   // Only re-renders when todos or searchQuery change
   ```

---

## 🏗️ Project Architecture Decisions

### Why Next.js?
- **File-based Routing**: Automatic route generation
- **Performance**: Built-in optimizations (image optimization, code splitting)
- **Developer Experience**: Hot reloading, error handling
- **Production Ready**: Optimized builds, deployment support

### Why Redux Toolkit?
- **Predictable State**: Single source of truth
- **Time Travel Debugging**: Redux DevTools
- **Scalability**: Easy to add new features
- **Community**: Large ecosystem and support

### Why Carbon Design System?
- **Professional Look**: Enterprise-grade design
- **Accessibility**: WCAG 2.1 compliant
- **Consistency**: Standardized components
- **Maintenance**: IBM-maintained and updated

### Why TypeScript?
- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Autocomplete, refactoring
- **Documentation**: Types serve as documentation
- **Scalability**: Easier to maintain large codebases



### Browser Testing:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## 🚀 Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.


