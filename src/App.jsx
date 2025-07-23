import { useState } from 'react';
import './App.css';
import TodoForm from './TodoForm';
import TodoList from './todoList';

function App() {
  const [newTodo, setNewTodo] = useState('Hello world');
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm />
      <p> {newTodo} </p>
      <TodoList />
    </div>
  );
}

export default App;
