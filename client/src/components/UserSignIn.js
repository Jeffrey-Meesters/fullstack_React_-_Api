import React, { Component } from 'react';
import { Link }             from "react-router-dom";
import axios                from 'axios';

import ErrorList            from '../elements/ErrorList';

class UserSignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      emailAddress: '',
      password: '',
      formErrors: []
    }

    // I want the state to update and reflect values in input fields
    // when the user gives input
    this.inputChange = this.inputChange.bind(this);
  }

  inputChange(e) {
    // on input get the element id
    const target = e.target.id;
    // on input store the value of the current element
    const value = e.target.value;
    
    // switch to determin which inputfield the user is typing in
    switch(target) {
      // in case it is id emailAddress set that state
      case 'emailAddress':
        this.setState({
          emailAddress: value
        })
        break;
      // in case it is id password set that state
      case 'password':
        this.setState({
          password: value
        })
        break;
      default:
        // do nothing
    }
  }

  // form submission to the api
  submitForm = () => {
    // set up get call
    const method = 'get';
    const url = 'http://localhost:5000/api/users'

    // This should be the only place the user actually send auth data
    // The rest should be handled by a token/cookie
    // so get user credentials
    const auth = {
      username: this.state.emailAddress,
      password: this.state.password,
    }

    try {
      axios({
        method,
        url,
        auth,
      }).then((response) => {
        // When a success response returns the user is correctly validated
        // store the users email and JWT token we got from the api
        // isSignedIn is a method call in the parent (RoutesComponent)
        // So the auth state is hoisted to the component that has all the routes
        this.props.isSignedIn({
          loading: false,
          userMail: response.data.currentUser,
          token: response.data.jwtToken
        })
        // redirect to the courses
        this.props.history.push('/courses')
      }).catch((error) => {

        console.log(error)

      })
    } catch (error) {

      console.log('url', error)

    }
  }

  // Form validation
  validateForm = () => {
    // get the form input, which is this components state
    const formInput = this.state;
    // decalare an errors array to store errorrs
    const errors = [];

    // loop over the form input
    Object.keys(formInput).forEach((item) => {
      // if the current item is empty store an error
      if (formInput[item] === '') {
        errors.push({
          [item]: `${item} is not filled in` 
        })
      }
    })
    
    // Set the errors in component state
    // do that while keeping previous state
    this.setState( prevState => ({
      formErrors: {...prevState.formErrors, errors}
    }))

    // If there are errors, prevent form submit
    if (errors.length > 0) {
      return;
    }

    this.submitForm();
  }

  // User clicks cancel button
  handleCancel = (e) => {
    // prevent default behaviour
    e.preventDefault();
    // reset state to empty values
    this.setState({
      emailAddress: '',
      password: '',
      formErrors: []
    })
  }

  // User click on the form submit button
  handleSubmit = (e) => {
    // prevent default behaviour
    e.preventDefault();
    // Start with form validation
    this.validateForm()
  }

  render() {
    // Get error data from state
    const errorData = this.state.formErrors;
    let errorList = [];

    // If there are errors build the errorlist
    // And render in view
    if (errorData.errors) {
        const errorObject = errorData.errors;
        errorList = [];
        errorList = <ErrorList errorObject={errorObject} />;
    }

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <div>
            {errorList}
            <form onSubmit={this.handleSubmit}>
              <div>
                <input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" defaultValue={this.state.emailAddress} onChange={this.inputChange}/>
              </div>
              <div>
                <input id="password" name="password" type="password" className="" placeholder="Password" defaultValue={this.state.password} onChange={this.inputChange}/>
              </div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">Sign In</button>
                <button className="button button-secondary" type="button" onClick={this.handleCancel} >Cancel</button>
              </div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
        </div>
      </div>
    )
  }
}

export default UserSignIn;