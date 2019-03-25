import React, { Component } from 'react'
import {
    Route,
    Switch,
    Redirect,
}                           from 'react-router-dom';

import Header               from '../elements/Header';
import Courses              from './Courses';
import CreateCourse         from './CreateCourse';
import UpdateCourse         from './UpdateCourse';
import CourseDetail         from './CourseDetail';
import UserSignIn           from './UserSignIn';
import UserSignUp           from './UserSignUp';

import { checkAuth }        from '../helpers/checkAuth'

class RoutesComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userOptions: {},
            isAuth: false,
            cachKey: 'tucan',
            isLoading: true,
            previousePath: ''
        }
    }

    // The route listener is the key in my user authentication
    // I had some memory leaks because state was being set on components that where already dismounted
    // I've been searching hard to find solutions for this and came across an anti-pattern that basically did:
    // set a state value to true on component did mount and to false on component unmount. Use that boolean to determine if state in an async cal should be set.
    // I used that pattern in Courses.js
    // By a lot of trial and error I found my own solution: Give every call when called a true or false value.
    // True whenever normal calling behaviour should accour, false when the component unmounts, which calls the function but does nothing
    // This resulted in not having a no-op memory leak warning anymore.
    routeListner = (shouldListen) => {
        // first get history passed in the props (fram app.js)
        const history = this.props.history;

        // So if should listen, listen to route changes
        if (shouldListen) {
            // listen is a method on the history object which is called when a route changes
            history.listen((location) => {

                // get the cached token. The name of the token is in state
                const cachedToken = localStorage.getItem(this.state.cachKey);
                
                // If there is no cached token, and the current route is not signin
                if(!cachedToken && location.pathname !== '/signin') {
                    // set previous path to /signin and redirect to signin
                    // then stop the script
                    this.setState({
                        previousePath: '/signin'
                    })

                    this.props.history.push('/signin')
                    return;
                }
                
                if (location.pathname !== this.state.previousePath) {
                    // If current route does not equal the previouse path check if the user is allowed to access.

                    // checkout is defined in the helpers/checkout.js file.
                    // It receives a boolean first for the same reason described above with the routeListner
                    // send the cachedToken and the cache Key.
                    checkAuth(true, cachedToken, this.state.cachKey).then((isAuth) => {
  
                        // isAuth is a boolean
                        this.setState({
                            isAuth: isAuth,
                            isLoading: false,
                            previousePath: location.pathname
                        })
                        
                        // If user is not correctly authenticated
                        // redirect to the sign in screen
                        // any JWT in storage is removed by checkAuth
                        if (!isAuth) {
                            this.props.history.push('/signin')
                        }

                    });
                }
            })
        } else {
            
            // Component did unmount so ampty listener
            history.listen();
        
        }
    }

    componentDidMount() {
        // get cachedToken
        const cachedToken = localStorage.getItem(this.state.cachKey);

        if (cachedToken) {
            // check is the user is authenticated
            checkAuth(true, cachedToken, this.state.cachKey).then((isAuth) => {
  
                this.setState({
                    isAuth: isAuth,
                    isLoading: false,
                    previousePath: this.props.history.location.pathname
                })

                // If user is not correctly authenticated
                // redirect to the sign in screen
                // any JWT in storage is removed by checkAuth
                if (!isAuth) {
                    this.props.history.push('/signin')
                }

            });

        // if there is no cached token and the user is not already on /signin or signup
        // redirect user to signgin
        } else if (this.props.history.location.pathname !== '/signin' && this.props.history.location.pathname !== '/signup') {
            this.props.history.push('/signin')
        }
        
        // Initiate routeListner
        this.routeListner(true);
    }

    componentWillUnmount() {
        // On unmount cancel checkAuth
        checkAuth(false)
        // Clear routeListner
        this.routeListner(false);
    }
    
    userSignIn = (data) => {
        // receives data from the UserSignIn child component
        // when the user correctly authenticates by form submit

        if (data.token) {
            this.setState({
                userOptions: {
                    userId: data.email,
                    token: data.token
                },
                isAuth: true,
                isLoading: false,
            })
      
            // I store it in state so it persist when refreshing the page
            // The apps state would be reseted on refresh
            localStorage.setItem(this.state.cachKey, data.token);
        }
    }

    // I had some trouble figuring out nested routes within a switch
    // found the solution here: https://stackoverflow.com/questions/41474134/nested-routes-with-react-router-v4

    render() {
        return (
            <div className="Router">
                <Header />
                <Switch>
                <Redirect from="/" exact to="/courses" />
                <Route
                    path="/courses"
                    render={({ match: { url } }) => (
                    <>
                        <Route exact path={ `${url}` } component={Courses} />
                        
                        {/* 
                            This is a protected route
                            When the user is authenticated render component
                            Else render redirect component witch redirects to /signin
                        
                        */}
                        <Route exact path={ `${url}/create` } render={ 
                            () => (this.state.isAuth) ? <CreateCourse history={ this.props.history } /> : <Redirect to="/signin" />
                        } />
                        <Route exact path={ `${url}/:courseId/detail` } component={CourseDetail} />
                        <Route exact path={ `${url}/:courseId/detail/update` } component={UpdateCourse} />
                    </>
                    )}
                />
                <Route exact path="/signin" render={() => <UserSignIn history={ this.props.history } isSignedIn={this.userSignIn} />} />
                <Route exact path="/signup" component={UserSignUp} />
                <Route exact path="/sigout" />
                {/* <Route component={NoMatch} /> */}
                </Switch>
            </div>
        )
    }
}

export default RoutesComponent;