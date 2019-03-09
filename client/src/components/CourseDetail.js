import React, { Component } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

import MaterialsList from '../elements/MaterialListRender';
import CourseDescription from '../elements/CourseDescriptionRender';

class CourseDetails extends Component {
  constructor() {
    super()

    this.state = {
      courseData: [],
      ownerData: [],
      postData: {
        name: 'gerrit@gmail.com',
        password: 'gerrit'
      }
    }
  }

  getOwner = (ownerId) => {
    try {
      axios.get(`http://localhost:5000/api/owner/${ownerId}`, this.state.postData).then((response) => {
        this.setState({
          loading: false,
          ownerData: response.data
        });

      }).catch((error) => {
        console.log('axios', error);
      })
    } catch(error) {
      console.log('url', error)
    }  
  }

  componentWillMount() {

    
    try {
      axios.get(`http://localhost:5000/api/courses/${this.props.match.params.courseId}`, this.state.postData).then((response) => {
        this.setState({
          loading: false,
          courseData: response.data
        });

        this.getOwner(response.data.user);

      }).catch((error) => {
        console.log('axios', error);
      })
    } catch(error) {
      console.log('url', error)
    }  
  }

  render() {
    const courseData = this.state.courseData;
    const ownerData = this.state.ownerData;
    return (
        <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              <span>
                <Link className="button" to={"courses/update/"+this.props.match.params.courseId}>
                  Update Course
                </Link>
                <Link className="button" to="/yolo">
                  Delete Course
                </Link>
              </span>
              <Link className="button button-secondary" to="/courses">
                Return to List
              </Link>
            </div>
          </div>
        </div>
        <div className="bounds course--detail">
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{courseData.title}</h3>
              <p>By {ownerData.firstName} {ownerData.lastName}</p>
            </div>
            <div className="course--description">
              <CourseDescription description={courseData.description} />
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                <li className="course--stats--list--item">
                  <h4>Estimated Time</h4>
                  <h3>{courseData.estimatedTime}</h3>
                </li>
                <li className="course--stats--list--item">
                  <h4>Materials Needed</h4>
                  <ul>
                    <MaterialsList listItems={courseData.materialsNeeded} />
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CourseDetails;