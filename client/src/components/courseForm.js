import React, { Component } from 'react';

class CourseForm extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    handleCancel = () => {
        console.log()
        this.props.history.push('/courses')
    }

    render() {
        console.log(this)
        return (
            <form>
                <div className="grid-66">
                    <div className="course--header">
                        <h4 className="course--label">Course</h4>
                        <div>
                            <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." defaultValue="" />
                        </div>
                        <p>By Joe Smith</p>
                    </div>
                    <div className="course--description">
                        <div>
                            <textarea id="description" name="description" className="" placeholder="Course description..."></textarea>
                        </div>
                    </div>
                </div>
                <div className="grid-25 grid-right">
                    <div className="course--stats">
                        <ul className="course--stats--list">
                        <li className="course--stats--list--item">
                            <h4>Estimated Time</h4>
                            <div>
                                <input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" defaultValue="" />
                            </div>
                        </li>
                        <li className="course--stats--list--item">
                            <h4>Materials Needed</h4>
                            <div>
                                <textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..."></textarea>
                            </div>
                        </li>
                        </ul>
                    </div>
                </div>
                <div className="grid-100 pad-bottom">
                    <button className="button" type="submit">
                        Create Course
                    </button>
                    <button type="button" className="button button-secondary" onClick={this.handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        )
    }
}

export default CourseForm;