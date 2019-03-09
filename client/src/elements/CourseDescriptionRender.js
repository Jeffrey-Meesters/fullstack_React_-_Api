import React from 'react';
import ReactMarkdown from 'react-markdown';

const CourseDesciption = ({description}) => {
    return <ReactMarkdown source={description} />
}

export default CourseDesciption;