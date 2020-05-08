import { IAxios } from '../../interfaces';
import CGlobal from './global';
import CMap from './map';
import CNode from './node';
import CNodeType from './node_type';
import CUser from './user';
import CExtentionAPI from './extention';

export class CApi {
  /**
   * @description Axios params
   */
  private axios: IAxios;
  /**
   * Create simple API class
   * @param axios Axios params
   */
  constructor(axios: IAxios) {
    this.axios = axios;
  }

  /**
   * @description global api methods
   */
  public get global(): CGlobal {
    return new CGlobal(this.axios);
  }

  /**
   * @description map api methods
   */
  public get map(): CMap {
    return new CMap(this.axios);
  }

  /**
   * @description node api methods
   */
  public get node(): CNode {
    return new CNode(this.axios);
  }

  /**
   * @description node type api methods
   */
  public get nodetype(): CNodeType {
    return new CNodeType(this.axios);
  }

  /**
   * @description user api methods
   */
  public get user(): CUser {
    return new CUser(this.axios);
  }

  /**
   * @description user api methods
   */
  public get extention(): CExtentionAPI {
    return new CExtentionAPI(this.axios);
  }
}
