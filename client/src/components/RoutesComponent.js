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
        }
    }

    routeListner = (shouldListen) => {
        const history = this.props.history;

        if (shouldListen) {
            history.listen((location) => {

                const cachedToken = localStorage.getItem(this.state.cachKey);
                
                if(!cachedToken && location.pathname !== '/signin') {
                   
                    this.setState({
                        previousePath: '/signin'
                    })

                    this.props.history.push('/signin')
                    return;
                }
                
                if (location.pathname !== this.state.previousePath) {
                
                    checkAuth(true, cachedToken, this.state.cachKey).then((isAuth) => {
  
                        this.setState({
                            isAuth: isAuth,
                            isLoading: false,
                            previousePath: location.pathname
                        })

                    });
                }
            })
        } else {
            
            history.listen();
        
        }
    }

    componentDidMount() {
        const cachedToken = localStorage.getItem(this.state.cachKey);

        if (cachedToken) {
            
            checkAuth(true, cachedToken, this.state.cachKey).then((isAuth) => {
  
                this.setState({
                    isAuth: isAuth,
                    isLoading: false,
                    previousePath: this.props.history.location.pathname
                })

            });

        }  else {
            this.props.history.push('/signin')
        }
        
        this.routeListner(true);
    }

    componentWillUnmount() {
        checkAuth(false)
        this.routeListner(false);
    }
    
    userSignIn = (data) => {

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
                        <Route exact path={ `${url}/create` } isAuth={this.state.isAuth} render={ () => (this.state.isAuth) ? <CreateCourse /> : <Redirect to="/signin" />} />
                        <Route exact path={ `${url}/:courseId/detail` } component={CourseDetail} />
                        <Route exact path={ `${url}/:courseId/detail/update` } isAuth={this.state.isAuth} component={UpdateCourse} />
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