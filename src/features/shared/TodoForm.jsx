import { useState, useRef } from 'react';
import TextInputWithLabel from './TextInputWithLabel';

const TodoForm = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');
  const todoTitleInput = useRef(null);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

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
      <TextInputWithLabel
        elementId="todoTitle"
        label="Todo"
        onChange={handleTitleChange}
        ref={todoTitleInput}
        value={title}
      />
      <button type="submit" disabled={title.trim() === ''}>
        Add Todo
      </button>
    </form>
  );
};

export default TodoForm;
