import React, { Component } from 'react';

import ErrorList            from '../elements/ErrorList';
import { sendData } from '../helpers/callApi'


// I saw that the course create and course update views are exactly the same
// Except for that one holds current data of the existing course and the other is empty
// So i decided to use 1 form for both views
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

        // On input change all inputChange so we can save and show input
        this.inputChange = this.inputChange.bind(this)
    }

    inputChange = (e) => {
        // store current element id
        const target = e.target.id;
        // store current element value
        const value = e.target.value;

        // had to look up the switch syntax: https://www.w3schools.com/js/js_switch.asp
        // Decided which element received input and update that value in state
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
        // check if props courseData is the same as previous props courseData
        // if  not continue
        if (this.props.courseData !== prevProps.courseData) {
            // When component updates get courseData from props
            // store the data in state
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
        // get current location
        // current location tells us if the user is creating or updating a course
        const currentLocation = this.props.history.location.pathname
        const buttonText = (currentLocation === '/courses/create') ? 'Create' : 'Update';
        // store current location for future reference
        // Update the button text to show if the user is updating or creating a course
        this.setState({
            formLocation: currentLocation,
            buttonText: buttonText
        })
    }

    componentWillUnmount() {
        // call sendData with false to cancel stat updates
        sendData(false)
    }

    submitForm = () => {
        // On submit get current location from state
        const currentLocation = this.state.formLocation;
        let url = '';
        let method = ''
        let postData = {};

        // depending on the current location
        // we are creating or updating a course
        // So the api call should be build correctly:
        switch(currentLocation) {
            case '/courses/create':
                url = '/courses';
                method = 'post';
                break;
            case `/courses/${this.props.courseId}/detail/update`:
                url = `/courses/${this.props.courseId}`;
                method = 'put';
                break;
            default:
                // unknow location
        }

        // construct postData to send
        if (method === 'post') {
            postData = {
                user: [this.props.userDetails.id],
                title: this.state.title,
                description: this.state.description,
                estimatedTime: this.state.estimatedTime,
                materialsNeeded: this.state.materialsNeeded,
            }
        } else if (method === 'put' && this.state.loadedOwenerData._id === this.props.userDetails.id) {
            postData = {
                user: [this.state.loadedOwenerData._id],
                title: this.state.title,
                description: this.state.description,
                estimatedTime: this.state.estimatedTime,
                materialsNeeded: this.state.materialsNeeded,
            }
        } else {
            // method is unknown OR you managed to trigger an update (which i think is more likely)
            // updateing is not allowed when owner id and current user id are not the same
            // so you ended up here.. this is forbidden
            // don't worry, back-end is checking again
            this.props.history.push('/forbidden');
            return;
        }

        // call sendData with the current url, method and data and give it the JWT token
        const cachedToken = localStorage.getItem('tucan');
        sendData(true, url, method, postData, cachedToken).then((response) => {

            this.props.history.push('/courses')

        }).catch((error) => {
            let errorValues = [error.response.data];
            this.setState(prevState => ({
                error: { ...prevState.error, errorValues }
            }))
        })
    }

    formValidation = () => {
        // form input is in current state
        const currentState = this.state;
        // create an emprty array that holds the errors
        let errorValues = [];

        // loop over the current state items
        // If ones value is empty add it to the error array
        Object.keys(currentState).forEach((item) => {
            if (currentState[item] === '') {
                errorValues.push({
                    [item]: `${item} is not filled in`
                })
            }
        })

        // Set the errors on state including existing once
        this.setState( prevState => ({
            error: {...prevState.error, errorValues}
        }))

        // If errors stop script
        if (errorValues.length > 0) {
            return;
        }

        // continue to form submit
        this.submitForm()
    }

    handleSubmit = (e) => {
        // prevent default fomr behaviour
        e.preventDefault();
        // start form validation
        this.formValidation()
    }

    handleCancel = (e) => {
        // User clicked cancel, empty everything and redirect to courses
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
        if (this.props.courseId) {
            this.props.history.push(`/courses/${this.props.courseId}/detail`)
        } else {
            this.props.history.push('/courses')
        }
    }

    render() {
        // get error data
        // if errors create error list and bring to view
        const errorData = this.state.error;
        let errorList = [];
        let Owner = [];

        if (errorData.errorValues) {
            const errorObject = errorData.errorValues;
            errorList = [];
            errorList = <ErrorList errorObject={errorObject} />;
        }

        // TODO NEED TO CREATE CORRECT BEHAVIOUR
        // show course owner name
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