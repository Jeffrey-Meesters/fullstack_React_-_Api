import React, { Component } from 'react';
import axios from 'axios';

import ErrorList from '../elements/ErrorList';

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
            response: [],
            loadedOwenerData: []
        }

        this.inputChange = this.inputChange.bind(this)
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

    // I had some trouble getting the course data into the form
    // Looked into lifecycles and found this solution: https://reactjs.org/docs/react-component.html
    // for componendDidUpdate not getting stuck in a loop
    componentDidUpdate(prevProps) {
        if (this.props.courseData !== prevProps.courseData) {
            const courseData = this.props.courseData;
            this.setState({
                title: courseData.title,
                description: courseData.description,
                estimatedTime: courseData.estimatedTime,
                materialsNeeded: courseData.materialsNeeded,
            })
        }

        if (this.props.ownerData !== prevProps.ownerData) {
            const ownerData = this.props.ownerData;

            this.setState({
                loadedOwenerData: ownerData
            })
        }
    }

    componentDidMount() {
        const currentLocation = this.props.history.location.pathname
        const buttonText = (currentLocation === '/courses/create') ? 'Create' : 'Update';
  
        this.setState({
            formLocation: currentLocation,
            buttonText: buttonText
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
            user: [this.state.loadedOwenerData._id],
            title: this.state.title,
            description: this.state.description,
            estimatedTime: this.state.estimatedTime,
            materialsNeeded: this.state.materialsNeeded,
        }

        const auth = {
            username: 'Jeffrey@smith.com',
            password:'testt'
        }

        console.log(postData)
        try {
            axios({
                method,
                url,
                auth,
                data: postData,
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

    handleCancel = (e) => {
        e.preventDefault();
        this.setState({
            title: '',
            description: '',
            estimatedTime: '',
            materialsNeeded: '',
            error: [],
            formLocation: '',
            loading: false,
            response: [],
            loadedOwenerData: []
        })
        this.props.history.push('/courses')
    }

    render() {
        const errorData = this.state.error;
        let errorList = [];
        let Owner = [];

        if (errorData.errorValues) {
            const errorObject = errorData.errorValues;
            errorList = [];
            errorList = <ErrorList errorObject={errorObject} />;
        }

        if (this.state.loadedOwenerData) {
            Owner = <p>By {this.state.loadedOwenerData.firstName} {this.state.loadedOwenerData.lastName}</p>;
        } else {
            // it is currentUser
        }

        return (
            <div>
                {errorList}
                <form onSubmit={this.handleSubmit} >
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <div>
                                <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." onChange={this.inputChange} defaultValue={this.state.title}/>
                            </div>
                            {Owner}
                        </div>
                        <div className="course--description">
                            <div>
                                <textarea id="description" name="description" className="" placeholder="Course description..." onChange={this.inputChange} value={this.state.description} />
                            </div>
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats">
                            <ul className="course--stats--list">
                            <li className="course--stats--list--item">
                                <h4>Estimated Time</h4>
                                <div>
                                    <input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" defaultValue={this.state.estimatedTime} onChange={this.inputChange} />
                                </div>
                            </li>
                            <li className="course--stats--list--item">
                                <h4>Materials Needed</h4>
                                <div>
                                    <textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." onChange={this.inputChange} value={this.state.materialsNeeded}></textarea> 
                                </div>
                            </li>
                            </ul>
                        </div>
                    </div>
                    <div className="grid-100 pad-bottom">
                        <button className="button" type="submit">
                            {this.state.buttonText} Course
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