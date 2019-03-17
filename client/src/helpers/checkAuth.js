import axios from 'axios';

function removeToken(key) {
    localStorage.removeItem(key);
}

export async function checkAuth(shouldCheck, cachedToken, key) {
    if (shouldCheck) {
        if (cachedToken) {
            const method = 'GET';
            const url = 'http://localhost:5000/api/tokenAuth';

            try {
                const auth = await axios({
                    method,
                    url,
                    headers: {
                        'x-access-token': cachedToken
                    }
                }).then(() => {

                    return true;

                }).catch((error) => {

                    console.log('errr', error)
                    removeToken(key)
                    return false;

                })

                return auth;

            } catch (error) {

                removeToken(key)
                console.log('errr', error)
                return false;

            }
        } else {

            return false;
            
        }
    }

}
