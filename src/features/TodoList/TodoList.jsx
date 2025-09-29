import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  if (isLoading) return <p>Todo list loading...</p>;

  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);

  const currentTodos = filteredTodoList.slice(
    indexOfFirstTodo,
    indexOfFirstTodo + itemsPerPage
  );

  const handlePreviousPage = () => {
    const prev = Math.max(1, currentPage - 1);
    setSearchParams({ page: String(prev) });
  };

  const handleNextPage = () => {
    const next = Math.min(totalPages, currentPage + 1);
    setSearchParams({ page: String(next) });
  };

  useEffect(() => {
    if (totalPages > 0) {
      const invalid =
        Number.isNaN(currentPage) ||
        !Number.isFinite(currentPage) ||
        currentPage < 1 ||
        currentPage > totalPages;

      if (invalid) navigate('/');
    }
  }, [currentPage, totalPages, navigate]);

  return (
    <>
      {filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul className={styles.list}>
          {currentTodos.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default TodoList;
