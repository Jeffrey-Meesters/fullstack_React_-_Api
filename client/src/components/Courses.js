import React, { Component } from 'react';
import axios from 'axios';

import CourseCards from '../elements/courseCards';

class Courses extends Component {

  constructor() {
    super();

    this.state = {
      loading: true,
      coursesData: [],
    }
  }
 
  componentWillMount() {
    const postData = {
      name: 'gerrit@gmail.com',
      password: 'gerrit'
    }
    
    try {
      axios.get('http://localhost:5000/api/courses', postData).then((response) => {
        this.setState({
          loading: false,
          coursesData: response.data
        });
        console.log(this.state.coursesData);
      }).catch((error) => {
        console.log('axios', error);
      })
    } catch(error) {
      console.log('url', error)
    }  
  }

  render() {
    
    return (
      <div className="bounds">
        <CourseCards courseData={this.state.coursesData} />
        <div className="grid-33">
          <a className="course--module course--add--module" href="create-course.html">
            <h3 className="course--add--title">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg> New Course
            </h3>
          </a>
        </div>
      </div>
    )
  }
}

export default Courses;