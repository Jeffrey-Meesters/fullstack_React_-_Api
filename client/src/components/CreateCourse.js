import React, { Component } from 'react';

import CourseForm from './courseForm';
import { checkAuth }        from '../helpers/checkAuth'

class CreateCourse extends Component {
    componentWillMount() {
        const cachedToken = localStorage.getItem('tucan');
        if (cachedToken) {
          checkAuth(true, cachedToken, 'tucan').then((isAuth) => {

              // isAuth is a boolean

              this.props.saveState({
                  isAuth: isAuth,
                  previousePath: this.props.history.pathName
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

                  this.props.history.push('/forbidden')
              }

          });
        } else {
          this.props.history.push('/forbidden')
        }
    }
    render() {
        return (
            <div className="bounds course--detail">
                <h1>Create Course</h1>
                <CourseForm history={this.props.history} userDetails={this.props.userDetails} />
            </div>
        )
    }
}

export default CreateCourse;
