import React, { Component } from 'react';
import './App.css';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import RoutesComponent from './components/RoutesComponent';

// I had some trouble figuring out nested routes within a switch
// found the solution here: https://stackoverflow.com/questions/41474134/nested-routes-with-react-router-v4

const history = createBrowserHistory();

class App extends Component {

  render() {
    return (
      <Router history={ history } >
        <RoutesComponent history={history} />
      </Router>
    );
  }
}

export default App;
