import React            from 'react';
import ReactMarkdown    from 'react-markdown';

const MarkDown = ({markDown}) => {
    return <ReactMarkdown source={markDown} />
}

export default MarkDown;