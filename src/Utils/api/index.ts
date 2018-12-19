import { IAxios } from '../../interfaces';
import CGlobal from './global';
import CMap from './map';
import CNode from './node';
import CNodeType from './node_type';
import CUser from './user';

import axios from 'axios';

if (process.env.DEBUG === 'axios') {
  axios.interceptors.request.use(request => {
    console.log('New Request: ', request)
    return request
  });
}

export default class CApi {
  private axios: IAxios;
  constructor(axios: IAxios) {
    this.axios = axios;
  }

  public get global(): CGlobal {
    return new CGlobal(this.axios);
  }

  public get map(): CMap {
    return new CMap(this.axios);
  }

  public get node(): CNode {
    return new CNode(this.axios);
  }

  public get nodetype(): CNodeType {
    return new CNodeType(this.axios);
  }

  public get user(): CUser {
    return new CUser(this.axios);
  }
}
