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
import NotFound             from './NotFound';
import UnhandledError       from './UnhandledError';
import Forbidden            from './Forbidden';

class RoutesComponent extends Component {

    // Trust user untill checkout (helper function triggered in protected components) says otherwise
    // Setting it to false will result in miliseconds of user not being authenticated
    // which in turn results in behaviour that actually prevents running authentication and user stays unauthenticated
    constructor(props) {
        super(props)
        this.state = {
            userOptions: {},
            isAuth: true,
            cachKey: 'tucan',
            useKey: 'didNotWantThis',
            previousePath: ''
        }
    }

    // The route listener is the key in my user authentication
    routeListner = (shouldListen) => {
        // first get history passed in the props (fram app.js)
        const history = this.props.history;
        const whiteListedRoutes = ['/signin', '/signup', '/forbidden']
        // So if should listen, listen to route changes
        if (shouldListen) {
            // listen is a method on the history object which is called when a route changes
            history.listen((location) => {

                if (whiteListedRoutes.indexOf(location.pathname) === -1) {
                    this.setState({
                        previousePath: location.pathname
                    })
                }

                // Check if userdata is in localstorage
                // If it is save it to state
                // This needs to be done so when the user switches tabs in the browser
                // the welcome messages is set correctly in the header
                const userData = JSON.parse(localStorage.getItem(this.state.useKey));
                if (userData) {
                    this.setState({
                        userOptions: userData
                    })
                }

                // get the cached token. The name of the token is in state
                // If it is not there, user is not authenticated
                // So delete user credentials and set auth to false
                const cachedToken = localStorage.getItem(this.state.cachKey);
                if (!cachedToken) {
                    localStorage.removeItem(this.state.useKey)
                    this.setState({
                        userOptions: {},
                        isAuth: false
                    })
                }
            })
        } else {

            // Component did unmount so empty listener
            history.listen();

        }
    }

    componentWillMount() {
        // Check if userdata is in localstorage
        // If it is save it to state
        // This needs to be done so when the user switches tabs in the browser
        // the welcome messages is set correctly in the header
        const cachedUserData = JSON.parse(localStorage.getItem(this.state.useKey)) || {};
        if (!this.state.userOptions.firstName && cachedUserData.firstName) {
            this.setState({
                userOptions: {
                    id: cachedUserData.id,
                    userId: cachedUserData.userId,
                    firstName: cachedUserData.firstName,
                    lastName: cachedUserData.lastName,
                    token: cachedUserData.token
                }
            })
        }
    }

    componentDidMount() {
        // Initiate routeListner
        this.routeListner(true);
    }

    componentWillUnmount() {
        // Clear routeListner
        this.routeListner(false);
    }

    userSignIn = (data) => {
        // receives data from the UserSignIn child component
        // when the user correctly authenticates by form submit

        if (data.token) {
            this.setState({
                userOptions: {
                    id: data.id,
                    userId: data.userMail,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    token: data.token
                },
                isAuth: true
            })

            // I store it in state so it persist when refreshing the page
            // The apps state would be reseted on refresh
            // To set an object in storage you need to stringify it else it will be an [Object Object]
            localStorage.setItem(this.state.useKey, JSON.stringify({
                id: data.id,
                userId: data.userMail,
                firstName: data.firstName,
                lastName: data.lastName,
                token: data.token
            }))
            localStorage.setItem(this.state.cachKey, data.token);

            this.props.history.push(this.state.previousePath)
        }
    }

    saveToGlobalState = (data) => {
        if (data) {
            this.setState({
                isAuth: data.isAuth,
            })
        }
    }

    // I found a HOC way to big for protected routes and decided to use a manner explained by react router 4 itself
    // which basically (is a hoc but) is rendering a component based on a ternary operator which is based on if the user is authenticated or not
    // look in the function PrivateRoute: https://reacttraining.com/react-router/web/example/auth-workflow
    // The PrivateRoute is a HOC, but see the clean result I would have if I hadn't had to expplain myself, below

    render() {
        const authenticated = this.state.isAuth;
        return (
            <div className="Router">
                <Header userData={this.state.userOptions} isAuth={this.state.isAuth} history={ this.props.history} signOut={this.saveToGlobalState} />
                <Switch>
                    {/* redirect root route to courses route */}
                    <Redirect from="/" exact to="/courses" />

                    {/*
                        I had some trouble figuring out nested routes within a switch
                        found the solution here: https://stackoverflow.com/questions/41474134/nested-routes-with-react-router-v4
                    */}

                    <Route
                        path="/courses"
                        render={({ match: { url } }) => (
                        <>
                            {/* Courses overview */}
                            <Route exact path={ `${url}` } render={ () => <Courses history={ this.props.history } />} />

                            {/*
                                Create course
                                This is a protected route
                                When the user is authenticated render component
                                Else render redirect component witch redirects to /signin
                                I could use a HOC, but this is cleaner
                            */}

                            <Route exact path={ `${url}/create` } render={
                                (props) => (authenticated) ?
                                <CreateCourse {...props} history={ this.props.history } saveState={this.saveToGlobalState} userDetails={this.state.userOptions} /> :
                                <Redirect to="/signin" />
                            } />

                            {/* Course details */}

                            <Route exact path={ `${url}/:courseId/detail` } render={
                                (props) => <CourseDetail {...props} userDetails={this.state.userOptions} />
                            } />

                            {/*
                                Update course
                                This is a protected route
                                When the user is authenticated render component
                                Else render redirect component witch redirects to /signin
                                I could use a HOC, but this is cleaner
                            */}

                            <Route exact path={ `${url}/:courseId/detail/update` } render={
                                (props) => (authenticated) ?
                                <UpdateCourse {...props} userDetails={this.state.userOptions} saveState={this.saveToGlobalState}/> :
                                <Redirect to="/signin" />
                            } />
                        </>
                        )}
                    />
                    {/* Sign in */}
                    <Route exact path="/signin" render={() => <UserSignIn history={ this.props.history } isSignedIn={this.userSignIn} />} />
                    {/* Sign up */}
                    <Route exact path="/signup" render={() => <UserSignUp history={ this.props.history } />} />
                    {/* logout */}
                    <Route exact path="/signout" />
                    {/* forbidden route */}
                    <Route exact path="/forbidden" component={Forbidden} />
                    {/* route for errors */}
                    <Route exact path="/error" component={UnhandledError} />
                    {/* When no route matches show not found component */}
                    <Route component={NotFound} />
                </Switch>
            </div>
        )
    }
}

export default RoutesComponent;
