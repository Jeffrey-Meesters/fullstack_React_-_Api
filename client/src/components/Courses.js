import React, { Component } from 'react';
import axios                from 'axios';
import { Link }             from "react-router-dom";

import CourseCards          from '../elements/courseCards';

class Courses extends Component {

  constructor() {
    super();
    // I had a memory leak when an api call has been made
    // that resolved after the component unmounted and tried to set state, which is a no-op
    // When mounting this is false, when unmounting this is true
    // Use this boolean to determine if state should be set
    this._isMounted = false;
    this.state = {
      loading: true,
      coursesData: [],
    }
  }
 
  getCourseData = () => {

    // TODO check if this postdata is still needed, or that we can switch to JWT
    const postData = {
      name: 'gerrit@gmail.com',
      password: 'gerrit',
    }
    
    try {
      axios.get('http://localhost:5000/api/courses', postData).then((response) => {

        // If component is still mounted set state
        if (this._isMounted) {
          this.setState({
            loading: false,
            coursesData: response.data
          });
        }

      }).catch((error) => {
        console.log('axios', error);
      })
    } catch(error) {
      console.log('url', error)
    }
    
  }

  componentDidMount() {
    this._isMounted = true;
    this.getCourseData()
  }

  componentWillUnmount() {
    // set isMounted to false so state does not get updated when this component unmounts
    this._isMounted = false;
  }

  render() {
    return (
      <div className="bounds">
        <CourseCards courseData={this.state.coursesData} />
        <div className="grid-33">
          <Link className="course--module course--add--module" to="/courses/create">
            <h3 className="course--add--title">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg> New Course
            </h3>
          </Link>
        </div>
      </div>
    )
  }
}

export default Courses;