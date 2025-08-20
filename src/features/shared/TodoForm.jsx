import { useState, useRef } from 'react';

const TodoForm = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');
  const todoTitleInput = useRef(null);

  const handleAddTodo = (event) => {
    event.preventDefault();

    if (title.trim() === '') return;

    onAddTodo(title);
    setTitle('');
    todoTitleInput.current.focus();
  };

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        type="text"
        id="todoTitle"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        ref={todoTitleInput}
      />
      <button type="submit" disabled={title.trim() === ''}>
        Add Todo
      </button>
    </form>
  );
};

export default TodoForm;
