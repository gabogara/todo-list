import { useState } from 'react';
import './App.css';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

function App() {
  const addTodo = (title) => {
    const newTodo = {
      title,
      id: Date.now(),
    };
    setTodoList([...todoList, newTodo]);
  };
  const [todoList, setTodoList] = useState([]);
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} />
    </div>
  );
}

export default App;
