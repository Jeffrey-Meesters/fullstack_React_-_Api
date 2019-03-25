import React, { Component } from 'react';

import CourseForm from './courseForm';

class CreateCourse extends Component {
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