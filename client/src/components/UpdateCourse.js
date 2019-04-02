import React, { Component } from 'react';
import axios                from 'axios';

import { checkAuth }        from '../helpers/checkAuth'
import CourseForm           from './courseForm';

class UpdateCourse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      courseData: [],
      ownerData: []
    }
  }

  async getOwner(ownerId) {
    const cachedToken = localStorage.getItem('tucan');
    await axios.get(`http://localhost:5000/api/owner/${ownerId}`, {
      headers: {
        'x-access-token': cachedToken
      }
    }).then((response) => {

      if (this.props.userDetails.id !== response.data._id) {
        this.props.history.push('/forbidden');
        return;
      }
      this.setState({
        loading: false,
        ownerData: response.data
      });
    }).catch((error) => {
      this.props.history.push('/error')
    })
  }

  componentWillMount() {
    const cachedToken = localStorage.getItem('tucan');
    if (cachedToken) {

      checkAuth(true, cachedToken, 'tucan').then((isAuth) => {

          // isAuth is a boolean
          this.props.saveState({
              isAuth: isAuth,
              previousePath: this.props.history.pathName
          })

        // Get requested course data
        axios.get(`http://localhost:5000/api/courses/${this.props.match.params.courseId}`).then((response) => {
          this.setState({
            courseData: response.data
          });

          // get course owner data with owner id
          this.getOwner(response.data.user);

        }).catch((error) => {
          this.props.history.push('/error')
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
    } else {
      this.props.history.push('/forbidden')
    }
  }

  // pass all fetched data down to CourseForm
  render() {
    return (
      <div className="bounds course--detail">
        <h1>Update Course</h1>
        <CourseForm history={this.props.history} courseId={this.props.match.params.courseId} courseData={this.state.courseData} ownerData={this.state.ownerData} userDetails={this.props.userDetails} />
      </div>
    )
  }
}

export default UpdateCourse;
