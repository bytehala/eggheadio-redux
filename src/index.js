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
  console.log(action.filter);
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
  }
};

const todoApp = combineReducers({ todos, visibilityFilter });
const store = createStore(todoApp);

const FilterLink = ({filter, children}) => {
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
}

let todoIndex = 0;
class TodoApp extends Component {
  render() {
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
        
        <ul>
          {this.props.todos.map((td) => (
            <li
              key={td.id}
              onClick={() => {
                store.dispatch({ type: "TOGGLE_TODO", id: td.id });
              }}
              style={{
                textDecoration: td.completed? 'line-through' : 'none'
              }}
            >
              {td.text}
            </li>
          ))}
        </ul>

        <p>
          Show: {' '}
          <FilterLink filter='SHOW_ALL'>All</FilterLink>
          {' '}
          <FilterLink filter='SHOW_COMPLETED'>Completed</FilterLink>
          {' '}
          <FilterLink filter='SHOW_ACTIVE'>Active</FilterLink>
          {' '}
        </p>
      </div>
    );
  }
}

function render() {

  ReactDOM.render(
    <div>
      <TodoApp todos={store.getState().todos} />
    </div>,
    document.getElementById("root")
  );
}

store.subscribe(render);
render();
