import { useState, useRef } from 'react';
import styled from 'styled-components';
import TextInputWithLabel from './TextInputWithLabel';

const StyledForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
`;

const StyledButton = styled.button`
  &:disabled {
    font-style: italic;
  }
`;

const TodoForm = ({ onAddTodo, isSaving }) => {
  const [title, setTitle] = useState('');
  const todoTitleInput = useRef(null);

  const handleTitleChange = (e) => setTitle(e.target.value);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (title.trim() === '') return;

    onAddTodo(title);
    setTitle('');
    todoTitleInput.current?.focus();
  };

  return (
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        label="Todo"
        onChange={handleTitleChange}
        inputRef={todoTitleInput}
        value={title}
      />
      <StyledButton type="submit" disabled={title.trim() === '' || isSaving}>
        {isSaving ? 'Saving...' : 'Add Todo'}
      </StyledButton>
    </StyledForm>
  );
};

export default TodoForm;
