import Api from './api';
import Wrapper from './wrapper';

import axios from 'axios';

if (process.env.DEBUG === 'axios') {
  axios.interceptors.response.use(response => {
    // tslint:disable-next-line:no-console
    console.log(
      response.status,
      response.request.method,
      response.request.path
    );
    
    return response;
  });
}

export { Api, Wrapper };
