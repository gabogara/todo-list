import { useState, useEffect } from 'react';
import './App.css';
import TodoForm from './features/shared/TodoForm';
import TodoList from './features/TodoList/TodoList';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      const options = {
        method: 'GET',
        headers: { Authorization: token },
      };
      try {
        const resp = await fetch(url, options);
        if (!resp.ok)
          throw new Error(`NetworkError when attempting to fetch resource.`);
        const { records } = await resp.json();
        const mapped = records.map((record) => ({
          id: record.id,
          title: record.fields?.title ?? '',
          isCompleted: !!record.fields?.isCompleted,
        }));
        setTodoList(mapped);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

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
        throw new Error(`NetworkError when attempting to fetch resource.`);
      const { records } = await resp.json();

      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!savedTodo.isCompleted) savedTodo.isCompleted = false;

      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const completeTodo = (id) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: true };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  };

  const updateTodo = (id, newTitle) => {
    const updatedTodos = todoList.map((todo) =>
      todo.id === id ? { ...todo, title: newTitle } : todo
    );
    setTodoList(updatedTodos);
  };

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        isloading={isLoading}
      />

      {errorMessage && (
        <div>
          <hr />
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
