import React, { Component } from 'react';

import CourseForm from './courseForm';

class UpdateCourse extends Component {
  componentDidMount() {
    console.log('hi');
    console.log(this)
  }

  render() {
    return (
      <div className="bounds course--detail">
        <h1>Update Course</h1>
        <CourseForm history={this.props.history} courseId={this.props.match.params.courseId}/>
      </div>
    )
  }
}

export default UpdateCourse;