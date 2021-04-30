import React, { useEffect, useState } from 'react';
import classNames from './App.module.css';

const App = () => {
  const [todoOpen, setTodoOpen] = useState(false);
  const [todos, setTodos] = useState([]);

  useEffect(async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/todos`);
    const todos = await response.json();

    setTodos(todos);
  }, [])

  const whenTitleEnd = (ev) => setTodoOpen(true);
  const addTodo = async (e) => {
    e.preventDefault();

    const response = await fetch(`${process.env.REACT_APP_API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([
        { text: e.target.text.value, complete: false }
      ]),
    })
    const todos = await response.json();

    setTodos(todos);

  }
  const completeTodo = (todo) => async () => {
    todo.complete = !todo.complete;

    const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todo._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    const todos = await response.json();

    setTodos(todos);
  }
  const removeTodo = (todo) => async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todo._id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const todos = await response.json();

    setTodos(todos);
  }

  return (
    <div className={classNames.app}>
      {todoOpen ? (
        <div className={classNames.todo}>
          <h1>Todo</h1>
          <form className={`${classNames.inputBox}`} onSubmit={addTodo}>
            <input type="text" placeholder="Votre tâche" name="text" />
            <button type="submit">Ajouter une tache</button>
          </form>
          <div className={classNames.todoCard}>
            {todos.length === 0 && <p>Vous n'avez plus aucune taches :-)</p>}
            {todos.length > 0 && <p>Vous avez {todos.length} tâches</p>}
            {(todos.map((todo, i) => 
              <div className={`${classNames.todoEntry} ${todo.complete ? classNames.complete : ''}`} onClick={completeTodo(todo)} key={`todo-${i}`}>
                <p>{todo.text}</p>
                <button onClick={removeTodo(todo)}>Supprimer</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={classNames.title} onAnimationEnd={whenTitleEnd}>
          <h1>Bienvenue dans votre Todo list !</h1>
        </div>
      )}
    </div>
  )
}

export default App;