import React from 'react';

const MaterialsList = ({listItems}) => {
    
    const list = listItems.map((item) =>
        <li>
            {item}
        </li>
    );

    return list;
}

export default MaterialsList;