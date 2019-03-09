import React, { Component } from 'react';
import axios from 'axios';

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
        console.log(22, response)
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
    const data = this.state.courseData;
    console.log(data);
        return (
            <div>
            <div className="actions--bar">
              <div className="bounds">
                <div className="grid-100"><span><a className="button" href="/update-course.html">Update Course</a><a className="button" href="/yolo">Delete Course</a></span><a
                    className="button button-secondary" href="index.html">Return to List</a></div>
              </div>
            </div>
            <div className="bounds course--detail">
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <h3 className="course--title">{data.title}</h3>
                  <p>By Joe Smith</p>
                </div>
                <div className="course--description">
                  <CourseDescription description={data.description} />
                </div>
              </div>
              <div className="grid-25 grid-right">
                <div className="course--stats">
                  <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <h3>{data.estimatedTime}</h3>
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <ul>
                        <MaterialsList listItems={data.materialsNeeded} />
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