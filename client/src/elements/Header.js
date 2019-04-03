import React, { Component } from 'react';
import { Link }             from "react-router-dom";

import SignOut from './SignOut'

class Header extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userData: props.userData
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.userData !== prevProps.userData) {
            this.setState({
                userData: this.props.userData
            })
        }
    }

    signOut = () => {
        localStorage.removeItem('didNotWantThis');
        localStorage.removeItem('tucan');
        this.setState({
            userData: ''
        })
        // Somehow the Route component want to redirect to /forbidden
        // Regardless of where the user is, so used a very short time out
        // which resulted in redirecting to courses
        // without it, it would just go to /forbidden
        this.props.signOut({isAuth: false})
    }

    render() {
        let buttons;
        let welcome;

        if (this.state.userData.firstName) {
            welcome =
                <span>
                    Welcome {this.state.userData.firstName} {this.state.userData.lastName}
                </span>
        }

        if (!this.props.isAuth && !this.state.userData.firstName) {
            buttons = <>
                <Link className="signup" to="/signup">Sign Up</Link>
                <Link className="signin" to="/signin">Sign In</Link>
            </>;
        } else {
            buttons =
            <>
                {welcome}
                <SignOut history={ this.props.history } signOut={this.signOut}/>
            </>;
        }
        return (
            <div className="header">
                <div className="bounds">
                    <Link to="/courses">
                        <h1 className="header--logo">Courses</h1>
                    </Link>
                    <nav>
                        {buttons}
                    </nav>
                </div>
            </div>
        )
    }
}

export default Header;
