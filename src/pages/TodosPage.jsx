import TodoForm from '../features/shared/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';

function TodosPage({
  // states
  todoList,
  isLoading,
  isSaving,
  sortField,
  sortDirection,
  queryString,
  // handlers
  onAddTodo,
  onCompleteTodo,
  onUpdateTodo,
  onSetSortField,
  onSetSortDirection,
  onSetQueryString,
}) {
  return (
    <>
      <TodoForm onAddTodo={onAddTodo} isSaving={isSaving} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={onCompleteTodo}
        onUpdateTodo={onUpdateTodo}
        isLoading={isLoading}
      />

      <hr />

      <TodosViewForm
        sortField={sortField}
        setSortField={onSetSortField}
        sortDirection={sortDirection}
        setSortDirection={onSetSortDirection}
        queryString={queryString}
        setQueryString={onSetQueryString}
      />
    </>
  );
}

export default TodosPage;
