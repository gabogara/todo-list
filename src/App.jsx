import { useState, useEffect, useCallback, useReducer } from 'react';
import './App.css';
import styles from './App.module.css';
import TodoForm from './features/shared/TodoForm';
import TodoList from './features/TodoList/TodoList';
import TodosViewForm from './features/TodosViewForm';
import errorIcon from './assets/error.svg';
import Header from './features/shared/Header.jsx';
import TodosPage from './pages/TodosPage.jsx';
import { useLocation } from 'react-router-dom';

import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './features/reducers/todos.reducer.js';

function App() {
  const location = useLocation();
  const [title, setTitle] = useState('Todo List');

  // Reducer state (todoList, isLoading, isSaving, errorMessage)
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // URL for listing (GET) with sort/filter
  const encodeUrl = useCallback(() => {
    const u = new URL(url);
    u.searchParams.set('sort[0][field]', todoState.sortField);
    u.searchParams.set('sort[0][direction]', todoState.sortDirection);

    if (todoState.queryString.trim()) {
      const safe = todoState.queryString.replaceAll('"', '\\"');
      const formula = `SEARCH("${safe}", {title})`;
      u.searchParams.set('filterByFormula', formula);
    }
    return u.toString();
  }, [
    url,
    todoState.sortField,
    todoState.sortDirection,
    todoState.queryString,
  ]);

  // Load todos (pessimistic)
  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });

      const options = {
        method: 'GET',
        headers: { Authorization: token },
      };

      try {
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok)
          throw new Error('NetworkError when attempting to fetch resource.');
        const { records } = await resp.json();
        dispatch({ type: todoActions.loadTodos, records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error });
      }
    };
    fetchTodos();
  }, [encodeUrl, token]);

  // Add todo (pessimistic)
  const addTodo = async (title) => {
    dispatch({ type: todoActions.startRequest });

    const payload = {
      records: [
        {
          fields: { title, isCompleted: false },
        },
      ],
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok)
        throw new Error('NetworkError when attempting to fetch resource.');
      const { records } = await resp.json();
      dispatch({ type: todoActions.addTodo, records });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  // Update todo (optimistic)
  const updateTodo = async (id, newTitle) => {
    const existing = todoState.todoList.find((t) => t.id === id);
    if (!existing) return;

    const originalTodo = { ...existing };
    const editedTodo = {
      id,
      title: newTitle,
      isCompleted: existing.isCompleted,
    };

    // optimistic update
    dispatch({ type: todoActions.updateTodo, editedTodo });

    const payload = {
      records: [
        { id, fields: { title: newTitle, isCompleted: existing.isCompleted } },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok)
        throw new Error('NetworkError when attempting to fetch resource.');
      // no further state change on success (optimistic)
    } catch (error) {
      // revert on failure
      dispatch({ type: todoActions.revertTodo, originalTodo, error });
    }
  };

  // Complete todo (optimistic)
  const completeTodo = async (id) => {
    const target = todoState.todoList.find((t) => t.id === id);
    if (!target) return;

    const originalTodo = { ...target };

    // optimistic mark complete
    dispatch({ type: todoActions.completeTodo, id });

    const payload = {
      records: [{ id, fields: { title: target.title, isCompleted: true } }],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok)
        throw new Error('NetworkError when attempting to fetch resource.');
    } catch (error) {
      // revert to original todo if API fails
      dispatch({ type: todoActions.revertTodo, originalTodo, error });
    }
  };

  return (
    <div className={styles.app}>
      <Header title={title} />

      <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />

      <TodoList
        todoList={todoState.todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={todoState.isLoading}
      />

      <hr />
      <TodosViewForm
        sortField={todoState.sortField}
        setSortField={(v) =>
          dispatch({ type: todoActions.setSortField, value: v })
        }
        sortDirection={todoState.sortDirection}
        setSortDirection={(v) =>
          dispatch({ type: todoActions.setSortDirection, value: v })
        }
        queryString={todoState.queryString}
        setQueryString={(v) =>
          dispatch({ type: todoActions.setQueryString, value: v })
        }
      />

      {todoState.errorMessage && (
        <div role="alert" className={styles.errorBox}>
          <div className={styles.errorRow}>
            <img src={errorIcon} alt="" className={styles.errorIcon} />
            <p>{todoState.errorMessage}... Reverting todo...</p>
          </div>
          <button onClick={() => dispatch({ type: todoActions.clearError })}>
            Dismiss Error Message
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
