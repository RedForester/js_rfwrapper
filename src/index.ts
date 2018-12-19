import Api from './api';
import Wrapper from './wrapper';

import axios from 'axios';

if (process.env.DEBUG === 'axios') {
  axios.interceptors.response.use(response => {
    console.log(response.status, response.request.method, response.request.path)
    // console.log(response.data);
    return response
  });
}

export { Api, Wrapper };
