import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  if (isLoading) return <p>Todo list loading...</p>;

  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);
  return (
    <>
      {filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul className={styles.list}>
          {filteredTodoList.map((todo) => (
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
