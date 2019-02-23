import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import Header  from './elements/Header';
import Courses  from './components/Courses';
import CreateCourse  from './components/CreateCourse';
import UpdateCourse  from './components/UpdateCourse';
import CourseDetail  from './components/CourseDetail';
import UserSignIn  from './components/UserSignIn';
import UserSignUp  from './components/UserSignUp';

// I had some trouble figuring out nested routes within a switch
// found the solution here: https://stackoverflow.com/questions/41474134/nested-routes-with-react-router-v4

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Redirect from="/" exact to="/courses" />
            <Route
              path="/courses"
              render={({ match: { url } }) => (
                <>
                  <Route exact path={`${url}/`} component={Courses} />
                  <Route exact path={`${url}/create`} component={CreateCourse} />
                  <Route exact path={`${url}/detail/:courseId`} component={CourseDetail} />
                  <Route exact path={`${url}/update/:courseId`} component={UpdateCourse} />
                </>
              )}
            />         
            <Route exact path="/signin" component={UserSignIn} />
            <Route exact path="/signup" component={UserSignUp} />
            {/* <Route component={NoMatch} /> */}
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
