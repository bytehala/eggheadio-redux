/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { combineReducers, createStore } from "redux";
import { PropTypes } from "prop-types";

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

// This allows you to use FilterLink in other places
// without having to pass a whole lot of props from its parent
// It makes FilterLink plug-and-play
class FilterLink extends Component {

  componentDidMount() {
    const {store} = this.context
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate()
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const { filter, children } = this.props;
    const {store} = this.context
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
FilterLink.contextTypes = {store: PropTypes.object}


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

const AddTodo = (props, {store}) => {
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
          // onAddTodoClick={(inputValue) => {
            store.dispatch({
              type: "ADD_TODO",
              id: todoIndex++,
              text: input.value,
              completed: false,
            });
          // }}
          // onAddTodoClick(input.value);
          input.value = "";
        }}
      >
        Add Todo
      </button>
    </div>
  );
}
AddTodo.contextTypes = {store: PropTypes.object}

const Footer = () => {
  return (
    <p>
      Show: <FilterLink filter="SHOW_ALL">All</FilterLink>{" "}
      <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>{" "}
      <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>{" "}
    </p>
  );
};

class VisibleTodoList extends Component {
  
  componentDidMount() {
    const {store} = this.context
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate()
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const {store} = this.context
    const {todos, visibilityFilter} = store.getState()

    return(
      <TodoList
        todos={getVisibleTodos(todos, visibilityFilter)}
        onTodoClick={(id) => {
          store.dispatch({ type: "TOGGLE_TODO", id });
        }}
      />
    )
  }
}
VisibleTodoList.contextTypes = {store: PropTypes.object}

let todoIndex = 0;
const TodoApp = () => {
  return (
    <div>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>
  );
};

class Provider extends Component {

  getChildContext() {
    return {
      store: this.props.store
    }
  }

  render() {
    return this.props.children
  }
}
Provider.childContextTypes = {store: PropTypes.object}

const todoApp = combineReducers({ todos, visibilityFilter });


ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById("root")
);