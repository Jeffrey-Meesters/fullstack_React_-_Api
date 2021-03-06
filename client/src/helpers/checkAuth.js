import axios from 'axios';

// remove jwt token from localstorage
function removeToken(key) {
    localStorage.removeItem('didNotWantThis');
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
                    return {auth: true, data: response.data};
                } else {
                    removeToken(key)
                    return false;
                }

            }).catch(() => {
                // Something went wrong, remove token to be sure
                removeToken(key)
                return false;

            })

            // return true or false as answer to if the JWT is valid
            return auth;

        } else {
            // If component unmounts return false
            return false;

        }
    }

}
