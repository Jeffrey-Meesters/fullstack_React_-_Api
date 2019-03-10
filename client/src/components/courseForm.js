import React, { Component } from 'react';
import axios from 'axios';

import ErrorList from '../elements/ErrorList'

class CourseForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            description: '',
            estimatedTime: '',
            materialsNeeded: '',
            error: [],
            formLocation: '',
            loading: false,
            response: []
        }
    }

    inputChange = (e) => {
        const target = e.target.id;
        const value = e.target.value;

        // had to look up the switch syntax: https://www.w3schools.com/js/js_switch.asp
        switch(target) {
            case 'title':
                this.setState({
                    title: value
                })
                break;
            case 'description':
                this.setState({
                    description: value
                })
                break;
            case 'estimatedTime':
                this.setState({
                    estimatedTime: value
                })
                break;
            case 'materialsNeeded':
                this.setState({
                    materialsNeeded: value
                })
                break;
            default:
                // unknown input
        }
    }

    componentWillMount() {
        const currentLocation = this.props.history.location.pathname
        this.setState({
            formLocation: currentLocation
        })
    }

    submitForm = () => {
        const currentLocation = this.state.formLocation;
        let url = '';
        let method = ''

        switch(currentLocation) {
            case '/courses/create':
                url = 'http://localhost:5000/api/courses';
                method = 'post';
                break;
            case `/courses/${this.props.courseId}/detail/update`:
                url = `http://localhost:5000/api/courses/${this.props.courseId}`;
                method = 'put';
                break;
            default:
                console.log(currentLocation);
        }

        const postData = {
            title: this.state.title,
            description: this.state.description,
            estimatedTime: this.state.estimatedTime,
            materialsNeeded: this.state.materialsNeeded,
        }

        try {
            axios({
                method,
                url,
                postData
            }).then((response) => {
                this.setState({
                    loading: false,
                    response: response
                });
                console.log('working response course is saved in DB', response);
            }).catch((error) => {
                let errorValues = [error.response.data];
                this.setState(prevState => ({
                    error: { ...prevState.error, errorValues }
                }))
            })
        } catch (error) {
            console.log('url', error)
        }
    }

    formValidation = () => {
        const currentState = this.state;
        let errorValues = [];
        Object.keys(currentState).forEach((item) => {
            if (currentState[item] === '') {
                errorValues.push({
                    [item]: `${item} is not filled in`
                })
            }
        })

        this.setState( prevState => ({
            error: {...prevState.error, errorValues}
        }))

        if (errorValues.length > 0) {
            return;
        }

        this.submitForm()
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.formValidation()
    }

    handleCancel = () => {
        this.setState({
            title: '',
            description: '',
            estimatedTime: '',
            materialsNeeded: '',
            error: []
        })
        this.props.history.push('/courses')
    }

    render() {
        const errorData = this.state.error;
        let errors = [];
        if (errorData.errorValues) {
            errors = errorData.errorValues.map((error, index) =>
                <ErrorList errorItem={error} key={index} />
            )
        }


        return (
            <div>
                <div>
                    <h2 className="validation--errors--label">Validation errors</h2>
                    <div className="validation-errors">
                    <ul>
                        {errors}
                    </ul>
                    </div>
                </div>
                <form onSubmit={this.handleSubmit} >
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <div>
                                <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." defaultValue="" onChange={this.inputChange}/>
                            </div>
                            <p>By Joe Smith</p>
                        </div>
                        <div className="course--description">
                            <div>
                                <textarea id="description" name="description" className="" placeholder="Course description..." onChange={this.inputChange} />
                            </div>
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats">
                            <ul className="course--stats--list">
                            <li className="course--stats--list--item">
                                <h4>Estimated Time</h4>
                                <div>
                                    <input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" defaultValue="" onChange={this.inputChange} />
                                </div>
                            </li>
                            <li className="course--stats--list--item">
                                <h4>Materials Needed</h4>
                                <div>
                                    <textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." onChange={this.inputChange} ></textarea> 
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
            </div>
        )
    }
}

export default CourseForm;