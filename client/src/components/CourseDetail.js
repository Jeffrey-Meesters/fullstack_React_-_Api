import React, { Component } from 'react';
import axios from 'axios';

import MaterialsList from '../elements/MaterialListRender';

class CourseDetails extends Component {
  constructor() {
    super()

    this.state = {
      courseData: [],
      ownerData: [],
    }
  }

  getOwner = (usersArray) => {
    usersArray.forEach(userId => {
      // TODO this route needs to be created in the API
      axios.post(`http://localhost:5000/api/users/${userId}`).then((response) => {
        this.setState({
          // TODO I think there was somethig with prevState, use that
          ownerData: [this.state.ownerData, response.data],
        })
      })
    });
  }
  componentWillMount() {
    const postData = {
      name: 'gerrit@gmail.com',
      password: 'gerrit'
    }
    
    try {
      axios.get(`http://localhost:5000/api/courses/${this.props.match.params.courseId}`, postData).then((response) => {
        this.setState({
          loading: false,
          courseData: response.data
        });

        // this.getOwner(response.data.user);

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
                  <p>High-end furniture projects are great to dream about. But unless you have a well-equipped shop and some serious woodworking experience to draw on, it can be difficult to turn the dream into a reality.</p>
                  <p>Not every piece of furniture needs to be a museum showpiece, though. Often a simple design does the job just as well and the experience gained in completing it goes a long way toward making the next project even better.</p>
                  <p>Our pine bookcase, for example, features simple construction and it's designed to be built with basic woodworking tools. Yet, the finished project is a worthy and useful addition to any room of the house. While it's meant to rest on the floor, you can convert the bookcase to a wall-mounted storage unit by leaving off the baseboard. You can secure the cabinet to the wall by screwing through the cabinet cleats into the wall studs.</p>
                  <p>We made the case out of materials available at most building-supply dealers and lumberyards, including 1/2 x 3/4-in. parting strip, 1 x 2, 1 x 4 and 1 x 10 common pine and 1/4-in.-thick lauan plywood. Assembly is quick and easy with glue and nails, and when you're done with construction you have the option of a painted or clear finish.</p>
                  <p>As for basic tools, you'll need a portable circular saw, hammer, block plane, combination square, tape measure, metal rule, two clamps, nail set and putty knife. Other supplies include glue, nails, sandpaper, wood filler and varnish or paint and shellac.</p>
                  <p>The specifications that follow will produce a bookcase with overall dimensions of 10 3/4 in. deep x 34 in. wide x 48 in. tall. While the depth of the case is directly tied to the 1 x 10 stock, you can vary the height, width and shelf spacing to suit your needs. Keep in mind, though, that extending the width of the cabinet may require the addition of central shelf supports.</p>
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
                        {/* <MaterialsList listItems={data.materialsNeeded} /> */}
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