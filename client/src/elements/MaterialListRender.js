import React from 'react';
import ReactMarkdown from 'react-markdown';

const MaterialsList = ({listItems}) => {
    return <ReactMarkdown source={listItems} />
}

export default MaterialsList;