import { useState, useEffect, useCallback } from 'react';
import './App.css';
import styles from './App.module.css';
import TodoForm from './features/shared/TodoForm';
import TodoList from './features/TodoList/TodoList';
import TodosViewForm from './features/TodosViewForm';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeUrl = useCallback(() => {
    const u = new URL(url);
    u.searchParams.set('sort[0][field]', sortField);
    u.searchParams.set('sort[0][direction]', sortDirection);

    if (queryString.trim()) {
      const safe = queryString.replaceAll('"', '\\"');
      const formula = `SEARCH("${safe}", {title})`;
      u.searchParams.set('filterByFormula', formula);
    }
    return u.toString();
  }, [url, sortField, sortDirection, queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = {
        method: 'GET',
        headers: { Authorization: token },
      };
      try {
        const resp = await fetch(encodeUrl(), options);
        if (!resp.ok)
          throw new Error('NetworkError when attempting to fetch resource.');
        const { records } = await resp.json();
        const mapped = records.map((record) => ({
          id: record.id,
          title: record.fields?.title ?? '',
          isCompleted: !!record.fields?.isCompleted,
        }));
        setTodoList(mapped);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : String(error));
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [encodeUrl, token]);

  const addTodo = async (title) => {
    const newTodo = { title, isCompleted: false };

    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
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
      setIsSaving(true);
      const resp = await fetch(url, options);
      if (!resp.ok)
        throw new Error('NetworkError when attempting to fetch resource.');
      const { records } = await resp.json();

      const savedTodo = {
        id: records[0].id,
        title: records[0].fields?.title ?? '',
        isCompleted: !!records[0].fields?.isCompleted,
      };

      setTodoList((prev) => [...prev, savedTodo]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSaving(false);
    }
  };

  const updateTodo = async (id, newTitle) => {
    const editedTodo = todoList.find((t) => t.id === id);
    if (!editedTodo) return;

    const originalTodo = { ...editedTodo };

    setTodoList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );

    const payload = {
      records: [
        {
          id,
          fields: {
            title: newTitle,
            isCompleted: editedTodo.isCompleted,
          },
        },
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
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
      setTodoList((prev) => prev.map((t) => (t.id === id ? originalTodo : t)));
    }
  };

  const completeTodo = async (id) => {
    const target = todoList.find((t) => t.id === id);
    if (!target) return;

    const originalTodo = { ...target };

    setTodoList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: true } : t))
    );

    const payload = {
      records: [
        {
          id,
          fields: {
            title: target.title,
            isCompleted: true,
          },
        },
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
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
      setTodoList((prev) => prev.map((t) => (t.id === id ? originalTodo : t)));
    }
  };

  return (
    <div className={styles.app}>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />

      <hr />
      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />

      {errorMessage && (
        <div role="alert" className={styles.errorBox}>
          <p>{errorMessage}... Reverting todo...</p>
          <button onClick={() => setErrorMessage('')}>
            Dismiss Error Message
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
