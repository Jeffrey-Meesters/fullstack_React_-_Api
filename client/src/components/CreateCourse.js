import React, { Component } from 'react';

import CourseForm from './courseForm'

class CreateCourse extends Component {
    render() {
        return (
            <div className="bounds course--detail">
                <h1>Create Course</h1>
                <div>
                    <div>
                        <h2 className="validation--errors--label">Validation errors</h2>
                        <div className="validation-errors">
                        <ul>
                            <li>Please provide a value for "Title"</li>
                            <li>Please provide a value for "Description"</li>
                        </ul>
                        </div>
                    </div>
                    <CourseForm history={this.props.history}/>
                </div>
            </div>
        )
    }
}

export default CreateCourse;