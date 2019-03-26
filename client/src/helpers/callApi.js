import axios from 'axios';

export async function getData(shouldLoad, url) {
  // shouldLoad is false in componentWillUnmount I found out it will cancel data leaks in the form of setting state to unmounted components
  if (shouldLoad) {
    // get the requested url and whatever it returns and retun that emediately else catch error
    const data = await axios.get(`http://localhost:5000/api${url}`).then(response => response.data)
    .catch((error) => {
      console.log('axios', error);
    })

    // return the data to the callee
    return data;

  } else {
    return false;
  }
}

export async function sendData(shouldLoad, uri, method, postData) {
  // shouldLoad is false in componentWillUnmount I found out it will cancel data leaks in the form of setting state to unmounted components
  if (shouldLoad) {
      // send data to the api and return any response data else catch error
      const url = `http://localhost:5000/api${uri}`;
      const data = await axios({
        method,
        url,
        data: postData,
      }).then(response => response.data)
      .catch((error) => {
        console.log('axios', error);
      })

      // return data to callee
      return data;
  } else {
    return false;
  }
}

export async function deleteData(uri, cachedToken) {
    // send data to the api and return any response data else catch error
    const url = `http://localhost:5000/api${uri}`;
    const data = axios.delete(
      url,
      {
      headers: {
        'x-access-token': cachedToken
      }
    }).then(response => response.data)
    .catch((error) => {
      console.log('axios', error);
    })
    // return data to callee
    return data;
}