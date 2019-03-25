import axios from 'axios';

// remove jwt token from localstorage
function removeToken(key) {
    localStorage.removeItem(key);
}

// check for validity of the JWT
export async function checkAuth(shouldCheck, cachedToken, key) {
    // In componend unmount calls this is false
    if (shouldCheck) {
        // if the cachedToken is send with the call check for validity
        if (cachedToken) {
            // set up get call
            const method = 'GET';
            const url = 'http://localhost:5000/api/tokenAuth';

            try {
                // send JWT in headers to the api
                // On this route it will check the token
                const auth = await axios({
                    method,
                    url,
                    headers: {
                        'x-access-token': cachedToken
                    }
                }).then((response) => {
                    // when the call is done check if the response status is 200
                    // 200 = OK, so proceed else return false
                    if (response.status === 200) {
                        return true;
                    } else {
                        removeToken(key)
                        return false;
                    }

                }).catch((error) => {
                    // Soemthing went wrong while calling the api
                    console.log('errr', error)
                    removeToken(key)
                    return false;

                })

                // return true or false as answer to if the JWT is valid
                return auth;

            } catch (error) {
                // something went wrong with the get call
                console.log('errr', error)
                removeToken(key)
                return false;

            }
        } else {
            // If component unmounts return false
            return false;
            
        }
    }

}
