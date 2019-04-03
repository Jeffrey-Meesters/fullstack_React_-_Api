import React, { Component } from 'react';
import { Link }             from "react-router-dom";

 class SignOut extends Component {

    signOut = () => {
        this.props.signOut();
    }

    render() {
        return (
            <Link className="signout" to="" onClick={this.signOut} >Sign Out</Link>
        )
    }
}

export default SignOut;
