import axios from 'axios';

export async function getData(shouldLoad, uri, cachedToken) {
  // I had some memory leaks because state was being set on components that where already dismounted
  // I've been searching hard to find solutions for this and came across an anti-pattern that basically did:
  // set a state value to true on component did mount and to false on component unmount. Use that boolean to determine if state in an async cal should be set.
  // I used that pattern in Courses.js
  // By a lot of trial and error I found my own solution: Give every call when called a true or false value.
  // True whenever normal calling behaviour should accour, false when the component unmounts, which calls the function but does nothing
  // This resulted in not having a no-op memory leak warning anymore.
  // shouldLoad is false in componentWillUnmount I found out it will cancel data leaks in the form of setting state to unmounted components
  if (shouldLoad) {
    // get the requested url and whatever it returns and retun that emediately else catch error
    const data = await axios.get(
      `http://localhost:5000/api${uri}`,
      {
        headers: {
          'x-access-token': cachedToken
        }
      }
    ).then(response => response.data)
    .catch((error) => {
      return error;
    })

    // return the data to the callee
    return data;

  } else {
    return false;
  }
}

export async function sendData(shouldLoad, uri, method, postData, cachedToken) {
  // I had some memory leaks because state was being set on components that where already dismounted
  // I've been searching hard to find solutions for this and came across an anti-pattern that basically did:
  // set a state value to true on component did mount and to false on component unmount. Use that boolean to determine if state in an async cal should be set.
  // I used that pattern in Courses.js
  // By a lot of trial and error I found my own solution: Give every call when called a true or false value.
  // True whenever normal calling behaviour should accour, false when the component unmounts, which calls the function but does nothing
  // This resulted in not having a no-op memory leak warning anymore.
  // shouldLoad is false in componentWillUnmount I found out it will cancel data leaks in the form of setting state to unmounted components
  if (shouldLoad) {
      // send data to the api and return any response data else catch error
      const url = `http://localhost:5000/api${uri}`;
      const data = await axios({
        method,
        url,
        data: postData,
        headers: {
          'x-access-token': cachedToken
        }
      }).then(response => response.data)
      .catch((error) => {
        return error;
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
      return error;
    })
    // return data to callee
    return data;
}
