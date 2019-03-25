import React, { Component } from 'react';
import { Link }             from "react-router-dom";

import MarkDown             from '../elements/MarkDown';

import { getData, deleteData } from '../helpers/callApi';

class CourseDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      courseData: [],
      ownerData: [],
    }
  }

  getOwner = (ownerId) => {
    getData(true, `/owner/${ownerId}`).then((ownerData) => {
      this.setState({
        ownerData: ownerData
      });
    })
  }


  componentWillMount() {
    getData(true, `/courses/${this.props.match.params.courseId}`).then((courseDetails) => {
      
      let isOwner = false;
      if (courseDetails.user[0] === this.props.userDetails.id) {
        isOwner = true;
      }

      this.setState({
        courseData: courseDetails,
        isOwner: isOwner
      });

      this.getOwner(courseDetails.user[0]);
    
    })
  }

  componentWillUnmount() {
    getData(false);
  }

  deleteCourse = () => {
    if (this.state.isOwner) {
      const cachedToken = localStorage.getItem('tucan');
      deleteData(`/courses/${this.props.match.params.courseId}`, cachedToken).then((response) => {
        console.log(response)
      })
    } else {
      // redirect to now allowed
    }
  }

  render() {
    const courseData = this.state.courseData;
    const ownerData = this.state.ownerData;
    let updateLink;
    let deleteLink;
    console.log('çourse', courseData)
    console.log('owner', ownerData)
    if (this.state.isOwner) {
      updateLink = <Link className="button" to={`${this.props.match.url}/update`} >Update Course</Link>;
      deleteLink = <a className="button" onClick={this.deleteCourse}> Delete Course </a>;
    }

    return (
      <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              <span>
                {updateLink}
                {deleteLink}
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
              <MarkDown markDown={courseData.description} />
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
                    <MarkDown markDown={courseData.materialsNeeded} />
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