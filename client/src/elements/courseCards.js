import React from 'react';
import { Link } from "react-router-dom";

const CourseCards = ({courseData}) => {

    const courseList = courseData.map((course) =>
        <div className="grid-33" key={course._id}>
            <Link className="course--module course--link" to={`courses/detail/${course._id}`}>
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{course.title}</h3>
            </Link>
        </div>
    );

    return courseList;

}

export default CourseCards;