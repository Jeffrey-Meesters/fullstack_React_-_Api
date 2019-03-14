import React, { Component } from 'react';
import './App.css';
import {
  Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import axios from 'axios';

import Header  from './elements/Header';
import Courses  from './components/Courses';
import CreateCourse  from './components/CreateCourse';
import UpdateCourse  from './components/UpdateCourse';
import CourseDetail  from './components/CourseDetail';
import UserSignIn  from './components/UserSignIn';
import UserSignUp  from './components/UserSignUp';

// I had some trouble figuring out nested routes within a switch
// found the solution here: https://stackoverflow.com/questions/41474134/nested-routes-with-react-router-v4

const history = createBrowserHistory();

class App extends Component {
  constructor() {
    super()
    this.state = {
      userOptions: {},
      isAuth: false,
      cachKey: 'tucan'
    }
  }

  componentWillMount() {
    const cachedToken = localStorage.getItem(this.state.cachKey);

    if (cachedToken) {
      const method = 'GET';
      const url = 'http://localhost:5000/api/tokenAuth';
      const auth = `x-access-token: ${cachedToken}`;
      console.log(auth)
      try {
        axios({
          method,
          url,
          headers: {
            'x-access-token': cachedToken
          }
        }).then((response) => {
          console.log('working response course is saved in DB', response);

        }).catch((error) => {
          console.log(error);
            // let errorValues = [error.response.data];
            // this.setState(prevState => ({
            //     error: { ...prevState.error, errorValues }
            // }))
        })
      } catch (error) {
        console.log('url', error)
      }
    }
  }

  userSignIn = (data) => {
    this.setState({
      userOptions: {
        userId: data.email,
        token: data.token
      },
      isAuth: true
    })

    // I store it in state so it persist when refreshing the page
    // The apps state would be reseted on refresh
    localStorage.setItem(this.state.cachKey, data.token);
  }

  render() {
    return (
      <Router history={ history } >
        <div className="App">
          <Header />
          <Switch>
            <Redirect from="/" exact to="/courses" />
            <Route
              path="/courses"
              render={({ match: { url } }) => (
                <>
                  <Route exact path={ `${url}` } component={Courses} />
                  <Route exact path={ `${url}/create` } component={CreateCourse} />
                  <Route exact path={ `${url}/:courseId/detail` } component={CourseDetail} />
                  <Route exact path={ `${url}/:courseId/detail/update` } component={UpdateCourse} />
                </>
              )}
            />
            <Route exact path="/signin" render={() => <UserSignIn isSignedIn={this.userSignIn} />} />
            <Route exact path="/signup" component={UserSignUp} />
            <Route exact path="/sigout" />
            {/* <Route component={NoMatch} /> */}
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
