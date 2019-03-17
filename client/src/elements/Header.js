import React, { Component } from 'react';
import { Link }             from "react-router-dom";

class Header extends Component {
    render() {
        return (
            <div className="header">
                <div className="bounds">
                    <Link to="/courses">
                        <h1 className="header--logo">Courses</h1>
                    </Link>
                    <nav>
                        <Link className="signup" to="/signup">Sign Up</Link>
                        <Link className="signin" to="/signin">Sign In</Link>
                    </nav>
                </div>
            </div>
        )
    }
}

export default Header;