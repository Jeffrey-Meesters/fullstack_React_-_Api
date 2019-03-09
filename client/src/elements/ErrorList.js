import React from 'react';

const ErrorList = (errorItem) => {
    const errorItems = Object.keys(errorItem).map((item) => {
        return Object.values(errorItem[item])[0]
    })

    return (
        <li>{errorItems}</li>
    )
}

export default ErrorList;