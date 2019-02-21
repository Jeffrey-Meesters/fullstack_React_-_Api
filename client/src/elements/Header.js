import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <div class="header">
                <div class="bounds">
                    <h1 class="header--logo">Courses</h1>
                    <nav>
                        <a class="signup" href="sign-up.html">Sign Up</a>
                        <a class="signin" href="sign-in.html">Sign In</a>
                    </nav>
                </div>
            </div>
        )
    }
}

export default Header;