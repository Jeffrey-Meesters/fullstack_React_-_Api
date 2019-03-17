import axios from 'axios';

export async function getData(shouldLoad, url) {
  if (shouldLoad) {
    try {
      const data = await axios.get(`http://localhost:5000/api${url}`).then(response => response.data)
      .catch((error) => {
        console.log('axios', error);
      })

      return data;
    } catch (error) {
      console.log('url', error)
    }
  } else {
    return false;
  }
}

export async function sendData(shouldLoad, url, method, postData) {
  if (shouldLoad) {
    try {
      const data = await axios({
        method,
        url,
        data: postData,
      }).then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log('axios', error);
      })

      return data;
    } catch (error) {
      console.log('url', error)
    }
  } else {
    return false;
  }
}
