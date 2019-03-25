import React            from 'react';
import ReactMarkdown    from 'react-markdown';

// A plugin for presenting data that is made up of markdown
const MarkDown = ({markDown}) => {
    return <ReactMarkdown source={markDown} />
}

export default MarkDown;