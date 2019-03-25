import React, { Component } from 'react';
import './App.css';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import RoutesComponent from './components/RoutesComponent';

const history = createBrowserHistory();

class App extends Component {
  // App instatiates router with history
  render() {
    return (
      <Router history={ history } >
        <RoutesComponent history={history} />
      </Router>
    );
  }
}

export default App;
