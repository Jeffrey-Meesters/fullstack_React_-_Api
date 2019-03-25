import React, { Component } from 'react';
import { Link }             from "react-router-dom";
import axios                from 'axios';

import ErrorList            from '../elements/ErrorList';

class UserSignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
      confirmPass: '',
      formErrors: []
    }

    // On input call updateFormValue
    this.updateFormValue = this.updateFormValue.bind(this);
  }

  updateFormValue(e) {
    // get current element id
    const target = e.target.id;
    // get current element value
    const value = e.target.value;

    // if the current element id matched a case
    // update state of the matching input
    switch(target) {
      case 'firstName':
        this.setState({
          firstName: value
        })
        break;
      case 'lastName':
        this.setState({
          lastName: value
        })
        break;
      case 'emailAddress':
        this.setState({
          emailAddress: value
        })
        break;
      case 'password':
        this.setState({
          password: value
        })
        break;
      case 'confirmPassword':
        this.setState({
          confirmPass: value
        })
        break;
      default:
        // do nothing
    }
  }

  async submitForm() {
    // Create an object to post
    const postData = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      emailAddress: this.state.emailAddress,
      password: this.state.password,
      twj: window.location.hostname,
    }
    try {
      // Send data to the api to create an user
      await axios.post(`http://localhost:5000/api/users`, postData).then((response) => {
        console.log(response)
      }).catch((error) => {
        console.log('axios', error);
      })
    } catch(error) {
      console.log('url', error)
    }  
  }

  validateForm = () => {
    // Get input data which is in state
    const formInput = this.state;
    // Create an emprty errors array
    const errors = [];

    // loop over state items
    // if an item is empty throw an error
    Object.keys(formInput).forEach((item) => {
      if (formInput[item] === '') {
        errors.push({
          [item]: `${item} is not filled in` 
        })
      }
    })

    // Check if both password fields have the same input
    // if not create an extra error
    if (this.state.password !== this.state.confirmPass) {
      errors.push({
        confirmError: 'Passwords don\'t match'
      })
    }
    
    // Update error state and keep previous state
    this.setState( prevState => ({
      formErrors: {...prevState.formErrors, errors}
    }))

    // if errors stop script
    if (errors.length > 0) {
      return;
    }

    // coninue with form submit
    this.submitForm();
  }

  handleCancel = (e) => {
    // user canceled so empty all inputs and errors
    e.preventDefault();
    this.setState({
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
      confirmPass: '',
      formErrors: []
    })
  }

  handleSubmit = (e) => {
    // prevent default form submit behaviour
    e.preventDefault();
    // start validating the form
    this.validateForm()
  }

  render() {

    // Create errorData and if there show it in view
    const errorData = this.state.formErrors;
    let errorList = [];

    if (errorData.errors) {
        const errorObject = errorData.errors;
        errorList = [];
        errorList = <ErrorList errorObject={errorObject} />;
    }

    return (
        <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <div>
            {errorList}
            <form onSubmit={this.handleSubmit}>
              <div><input id="firstName" name="firstName" type="text" className="" placeholder="First Name" value={this.state.firstName} onChange={this.updateFormValue} /></div>
              <div><input id="lastName" name="lastName" type="text" className="" placeholder="Last Name" value={this.state.lastName} onChange={this.updateFormValue} /></div>
              <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={this.state.emailAddress} onChange={this.updateFormValue} /></div>
              <div><input id="password" name="password" type="password" className="" placeholder="Password" value={this.state.password} onChange={this.updateFormValue} /></div>
              <div><input id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password" value={this.state.confirmPass} onChange={this.updateFormValue} /></div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">Sign Up</button>
                <button type="button" className="button button-secondary" onClick={this.handleCancel} >Cancel</button></div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>
            Already have a user account? <Link to="signin"> Click here</Link> to sign in!
          </p>
        </div>
      </div>
    )
  }
}

export default UserSignUp;