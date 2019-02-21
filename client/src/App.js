import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

import Header  from './elements/Header';
import CourseDetail  from './components/CourseDetail';
import Courses  from './components/Courses';
import CreateCourse  from './components/CreateCourse';
import UpdateCourse  from './components/UpdateCourse';
import UserSignIn  from './components/UserSignIn';
import UserSignUp  from './components/UserSignUp';

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
        <Header />
        <Courses />
        <CourseDetail />
        <CreateCourse />
        <UpdateCourse />
        <UserSignIn />
        <UserSignUp />
      </div>
    );
  }
}

export default App;
