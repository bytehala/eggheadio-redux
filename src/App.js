import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { MyCounter } from './features/counter/MyCounter';
import {createStore, combineReducers} from 'redux';

function App() {

  const todo = (state, action) => {
    switch (action.type) {
      case 'ADD_TODO':
        return {
          id: action.id,
          text: action.text,
          completed: false
        };
      case 'TOGGLE_TODO':
        if (state.id !== action.id) {
          return state;
        }

        return {
          ...state,
          completed: !state.completed
        }
      default:
        return state;
    }
  }

  const todos = (state = [], action) => {
    switch (action.type) {
      case 'ADD_TODO': 
        return [
          ...state,
          todo(undefined, action)
        ];
      case 'TOGGLE_TODO': {
        return state.map(t => todo(t, action));
      }
      default:
        return state;
    }
  }

  const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
      case 'SET_VISIBILITY_FILTER':
        return action.filter;
      default:
        return state;
    }
  }

  // Reducer composition - manual way
  // const todoApp = (state = {}, action) => {
  //   return ({
  //     todos: todos(state.todos, action),
  //     visibilityFilter: visibilityFilter(
  //       state.visibilityFilter,
  //       action
      
  //     )
  //   }
  //   )
  // }

  // Reducer composition using combineReducers
  // keys here are the fields of the state object (e.g. state.todos becomes todos:)
  const todoApp = combineReducers({
    todos: todos,
    visibilityFilter: visibilityFilter
    // in shorthand notation it just becomes
    // todos,
    // visibilityFilter
  });

  


  // state = todos(state, {type: 'ADD_TODO', id: 0, text: 'Learn_Redux'});
  // state = todos(state, {type: 'TOGGLE_TODO', id: 0,});
  const store = createStore(todoApp);
  store.dispatch({type: 'ADD_TODO', id: 0, text: 'Learn_Redux'});
  store.dispatch({type: 'TOGGLE_TODO', id: 0})
  store.dispatch({type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_COMPLETED'});

  console.log(JSON.stringify(store.getState()));

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <MyCounter />
        <Counter />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </header>
    </div>
  );
}

export default App;
