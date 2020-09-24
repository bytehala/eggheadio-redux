/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { combineReducers, createStore } from "redux";

const todo = (state = {}, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        id: action.id,
        text: action.text,
        completed: action.completed,
      };
    case "TOGGLE_TODO":
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed,
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, todo(undefined, action)];
    case "TOGGLE_TODO":
      return state.map((td) => todo(td, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = "SHOW_ALL", action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
  }
};

const todoApp = combineReducers({ todos, visibilityFilter });
const store = createStore(todoApp);

const FilterLink = ({filter, currentFilter, children}) => {
  if (currentFilter !== filter)
  return (
    <a href='#'
     onClick={e => {
       e.preventDefault();
       store.dispatch({
         type: 'SET_VISIBILITY_FILTER',
         filter
       })
     }}>{children}</a>
  )

  return (
    <span>
      {children}
    </span>
  )
}

const getVisibleTodos = (todos, filter) => {
  switch(filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
    default:
      return todos;
  }
}

const Todo = ({text, completed, onClick, id}) => {
  return (
  <li
              // key={td.id}
              onClick={onClick}
              style={{
                textDecoration: completed? 'line-through' : 'none'
              }}
            >{text}</li>
  )
}

const TodoList = ({todos, onTodoClick}) => {
  return (
    <ul>
          {todos.map((td) => (
            <Todo key={td.id} onClick={() => onTodoClick(td.id)}
              {...td}
            />
          ))}
        </ul>
  )
}

let todoIndex = 0;
class TodoApp extends Component {
  render() {
    const {todos, visibilityFilter} = this.props
    const visibleTodos = getVisibleTodos(todos, visibilityFilter)
    return (
      <div>
        <input
          ref={(node) => {
            this.input = node;
          }}
        />
        <button
          onClick={() => {
            store.dispatch({
              type: "ADD_TODO",
              id: todoIndex++,
              text: this.input.value,
              completed: false,
            });
            this.input.value = '';
          }}
        >
          Add Todo
        </button>
        
        <TodoList todos={visibleTodos} onTodoClick={
          (id) => {
            store.dispatch({ type: "TOGGLE_TODO", id })
          }
        } />
        

        <p>
          Show: {' '}
          <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter}>All</FilterLink>
          {' '}
          <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter}>Completed</FilterLink>
          {' '}
          <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter}>Active</FilterLink>
          {' '}
        </p>
      </div>
    );
  }
}

function render() {

  ReactDOM.render(
    <div>
      <TodoApp {...store.getState()} />
    </div>,
    document.getElementById("root")
  );
}

store.subscribe(render);
render();
