import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

import ErrorList from '../elements/ErrorList';

class UserSignIn extends Component {
  constructor() {
    super()
    this.state = {
      emailAddress: '',
      password: '',
      formErrors: []
    }

    this.inputChange = this.inputChange.bind(this);
  }

  inputChange(e) {
    const target = e.target.id;
    const value = e.target.value;
    console.log(target, value)
    switch(target) {
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
      default:
        // do nothing
    }
  }

  submitForm = () => {
    const method = 'get';
    const url = 'http://localhost:5000/api/users'

    // This should be the only place the user actually send auth data
    // The rest should be handled by a token/cookie
    const auth = {
      username: this.state.emailAddress,
      password: this.state.password
    }

    console.log(auth)
    try {
      axios({
        method,
        url,
        auth,
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

  validateForm = () => {
    const formInput = this.state;
    const errors = [];
    Object.keys(formInput).forEach((item) => {
      if (formInput[item] === '') {
        errors.push({
          [item]: `${item} is not filled in` 
        })
      }
    })
    
    this.setState( prevState => ({
      formErrors: {...prevState.formErrors, errors}
    }))

    if (errors.length > 0) {
      return;
    }

    this.submitForm();
  }

  handleCancel = (e) => {
    e.preventDefault();
    this.setState({
      emailAddress: '',
      password: '',
      formErrors: []
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.validateForm()
  }

  render() {
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