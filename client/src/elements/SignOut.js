import React, { Component } from 'react';
import { Link }             from "react-router-dom";

 class SignOut extends Component {

    signOut = () => {
        localStorage.removeItem('didNotWantThis');
        localStorage.removeItem('tucan');

        // Somehow the Route component want to redirect to /forbidden
        // Regardless of where the user is, so used a very short time out
        // which resulted in redirecting to courses
        // without it, it would just go to /forbidden
        setTimeout(() => {
            this.props.history.push('/courses');
        },0)
    }

    render() {
        return (
            <Link className="signout" to="" onClick={this.signOut} >Sign Out</Link>
        )
    }
}

export default SignOut;
