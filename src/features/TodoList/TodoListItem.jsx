import { useState, useRef, useEffect } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import styles from './TodoListItem.module.css';

const TodoListItem = ({ todo, onCompleteTodo, onUpdateTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);
  const inputRef = useRef(null);

  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleCancel = () => {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  };

  const handleEdit = (event) => setWorkingTitle(event.target.value);

  const handleUpdate = (event) => {
    event.preventDefault();
    if (!isEditing) return;
    onUpdateTodo(todo.id, workingTitle);
    setIsEditing(false);
  };

  return (
    <li className={styles.item}>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`todo-${todo.id}`}
              label="Edit Todo"
              value={workingTitle}
              onChange={handleEdit}
              inputRef={inputRef}
            />
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit">Update</button>
          </>
        ) : (
          <>
            <label>
              <input
                type="checkbox"
                id={`checkbox-${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
            </label>
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
};

export default TodoListItem;
