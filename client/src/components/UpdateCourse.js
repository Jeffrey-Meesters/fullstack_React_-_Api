import React, { Component } from 'react';
import axios                from 'axios';

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
    try {
      await axios.get(`http://localhost:5000/api/owner/${ownerId}`, this.state.postData).then((response) => {
        this.setState({
          loading: false,
          ownerData: response.data
        });
      }).catch((error) => {
        console.log('axios', error);
      })
    } catch(error) {
      console.log('url', error)
    }  
  }

  async componentDidMount() {
    try {
      // Get requested course data
      await axios.get(`http://localhost:5000/api/courses/${this.props.match.params.courseId}`, this.state.postData).then((response) => {
        this.setState({
          courseData: response.data
        });
        
        // get course owner data with owner id
        this.getOwner(response.data.user);

      }).catch((error) => {
        console.log('axios', error);
      })
    } catch(error) {
      console.log('url', error)
    }  
  }

  // pass all fetched data down to CourseForm
  render() {
    return (
      <div className="bounds course--detail">
        <h1>Update Course</h1>
        <CourseForm history={this.props.history} courseId={this.props.match.params.courseId} courseData={this.state.courseData} ownerData={this.state.ownerData} />
      </div>
    )
  }
}

export default UpdateCourse;