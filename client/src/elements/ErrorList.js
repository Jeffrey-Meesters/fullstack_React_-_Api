import React from 'react';

const ErrorList = (errorObject) => {
    // receive an object with error data
    // loop over the items and put every item in an <li>
    // Show all li's in the returned view
    let errorItems = []
    const errors = errorObject.errorObject;
    errorItems = errors.map((error, index) => {
        return <li key={index}>{Object.values(error)[0]}</li>;
    });


    return (
        <div>
            <h2 className="validation--errors--label">Validation errors</h2>
            <div className="validation-errors">
                <ul>
                    {errorItems}
                </ul>
            </div>
        </div> 
    )
}

export default ErrorList;