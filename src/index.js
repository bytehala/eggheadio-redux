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

const Link = ({ active, onClick, children }) => {
  if (active)
    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
      >
        {children}
      </a>
    );

  return <span>{children}</span>;
};

class FilterLink extends Component {

  onComponentDidmount() {
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate()
    })
  }

  onComponentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const { filter, children } = this.props;
    // Before FilterLink subscribing to store:
    // This is okay because we update the whole app when the store updates
    // This is inefficient, we can just update FilterLink
    const visibilityFilter = store.getState().visibilityFilter;
    return (
      <Link
        active={visibilityFilter !== filter}
        onClick={() => {
          store.dispatch({
            type: "SET_VISIBILITY_FILTER",
            filter,
          });
        }}
      >
        {children}
      </Link>
    );
  }
}

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case "SHOW_ALL":
      return todos;
    case "SHOW_COMPLETED":
      return todos.filter((t) => t.completed);
    case "SHOW_ACTIVE":
      return todos.filter((t) => !t.completed);
    default:
      return todos;
  }
};

const Todo = ({ text, completed, onClick }) => {
  return (
    <li
      onClick={onClick}
      style={{
        textDecoration: completed ? "line-through" : "none",
      }}
    >
      {text}
    </li>
  );
};

const TodoList = ({ todos, onTodoClick }) => {
  return (
    <ul>
      {todos.map((td) => (
        <Todo key={td.id} onClick={() => onTodoClick(td.id)} {...td} />
      ))}
    </ul>
  );
};

const AddTodo = ({ onAddTodoClick }) => {
  let input;
  return (
    <div>
      <input
        ref={(node) => {
          input = node;
        }}
      />
      <button
        onClick={() => {
          onAddTodoClick(input.value);
          input.value = "";
        }}
      >
        Add Todo
      </button>
    </div>
  );
};

const Footer = ({ visibilityFilter }) => {
  return (
    <p>
      Show: <FilterLink filter="SHOW_ALL">All</FilterLink>{" "}
      <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>{" "}
      <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>{" "}
    </p>
  );
};

let todoIndex = 0;
const TodoApp = ({ todos, visibilityFilter }) => {
  return (
    <div>
      <AddTodo
        onAddTodoClick={(inputValue) => {
          store.dispatch({
            type: "ADD_TODO",
            id: todoIndex++,
            text: inputValue,
            completed: false,
          });
        }}
      />

      <TodoList
        todos={getVisibleTodos(todos, visibilityFilter)}
        onTodoClick={(id) => {
          store.dispatch({ type: "TOGGLE_TODO", id });
        }}
      />

      <Footer visibilityFilter={visibilityFilter} />
    </div>
  );
};

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
