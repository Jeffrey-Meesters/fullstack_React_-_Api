import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const postData = {
  name: 'gerrit@gmail.com',
  password: 'gerrit'
}

try {
  axios.get('http://localhost:5000/api/courses', postData).then((response) => {
    console.log(response);
  })
} catch(error) {
  console.log(error)
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
