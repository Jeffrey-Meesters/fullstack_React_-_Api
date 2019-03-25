import React, { Component } from 'react';
import { Link }             from "react-router-dom";

import SignOut from './SignOut'

class Header extends Component {
    render() {
        let buttons;

        if (!this.props.isAuth) {
            buttons = <>
                <Link className="signup" to="/signup">Sign Up</Link>
                <Link className="signin" to="/signin">Sign In</Link>
            </>;
        } else {
            buttons = 
            <>
                <span>
                    Welcome {this.props.userData.firstName} {this.props.userData.lastName}
                </span>
                <SignOut history={ this.props.history }/>
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