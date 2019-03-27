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

import { checkAuth }        from '../helpers/checkAuth'

class RoutesComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userOptions: {},
            isAuth: false,
            cachKey: 'tucan',
            useKey: 'didNotWantThis',
            previousePath: ''
        }
    }

    // The route listener is the key in my user authentication
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
                if(!cachedToken && location.pathname !== '/signin' && location.pathname !== '/signup' && location.pathname !== '/courses' && location.pathname !== '/forbidden') {
                    // set previous path to /signin and redirect to signin
                    // And reset state
                    // then stop the script
                    this.setState({
                        userOptions: {
                            userId: '',
                            firstName: '',
                            lastName: '',
                            token: ''
                        },
                        previousePath: '/forbidden',
                        isAuth: false,
                    })

                    this.props.history.push('/forbidden')
                    return;
                }

                if (cachedToken && location.pathname !== this.state.previousePath) {
                    // If current route does not equal the previouse path check if the user is allowed to access.

                    // checkout is defined in the helpers/checkout.js file.
                    // It receives a boolean first for the same reason described above with the routeListner
                    // send the cachedToken and the cache Key.
                    checkAuth(true, cachedToken, this.state.cachKey).then((isAuth) => {

                        // isAuth is a boolean
                        this.setState({
                            isAuth: isAuth,
                            previousePath: location.pathname
                        })

                        // If user is not correctly authenticated
                        // redirect to the sign in screen
                        // any JWT in storage is removed by checkAuth
                        if (!isAuth) {
                            // And reset state
                            this.setState({
                                userOptions: {
                                    userId: '',
                                    firstName: '',
                                    lastName: '',
                                    token: ''
                                }
                            })

                            this.props.history.push('/signin')
                        }

                    });
                }
            })
        } else {

            // Component did unmount so empty listener
            history.listen();

        }
    }

    componentWillMount() {
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

        // get cachedToken
        const cachedToken = localStorage.getItem(this.state.cachKey);

        if (cachedToken) {
            // check is the user is authenticated
            checkAuth(true, cachedToken, this.state.cachKey).then((isAuth) => {

                this.setState({
                    isAuth: isAuth,
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
        } else if (this.props.history.location.pathname !== '/signin' && this.props.history.location.pathname !== '/signup' && this.props.history.location.pathname !== '/courses' ) {
            // And reset state
            this.setState({
                userOptions: {
                    userId: '',
                    firstName: '',
                    lastName: '',
                    token: ''
                },
                isAuth: false,
            })

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
        }
    }

    // I found a HOC way to big for protected routes and decided to use a manner explained by react router 4 itself
    // which basically (is a hoc but) is rendering a component based on a ternary operator which is based on if the user is authenticated or not
    // look in the function PrivateRoute: https://reacttraining.com/react-router/web/example/auth-workflow
    // The PrivateRoute is a HOC, but see the clean result I would have if I hadn't had to expplain myself, below

    render() {
        return (
            <div className="Router">
                <Header userData={this.state.userOptions} isAuth={this.state.isAuth} history={ this.props.history}/>
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
                                (props) => (this.state.isAuth) ?
                                <CreateCourse {...props} history={ this.props.history } userDetails={this.state.userOptions} /> :
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
                                (props) => (this.state.isAuth) ?
                                <UpdateCourse {...props} userDetails={this.state.userOptions} /> :
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
