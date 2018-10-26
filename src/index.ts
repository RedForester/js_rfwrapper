import { IAxios, IParams } from './interfaces';
import CMap from './api/map';
import CGlobal from './api/global';
import CNode from './api/node';
import CNodeType from './api/node_type';
import CUser from './api/user';

export class api {
  private settings: IParams;
  private axios: IAxios;

  constructor(settings: IParams) {
    if (!settings.username || !settings.password) {
      throw new Error('You must set user email and password hash!');
    }

    this.settings = settings;
    this.axios = {
      auth: {
        username: this.settings.username,
        password: this.settings.password,
      },
      baseURL: this.settings.host || 'app.redforester.com',
      responseType: 'json',
    };
  }

  public get global(): CGlobal {
    return new CGlobal(this.axios);
  }

  public get map(): CMap {
    return new CMap(this.axios);
  }

  public get node(): CNode {
    return new CNode(this.axios)
  }

  public get nodetype(): CNodeType {
    return new CNodeType(this.axios)
  }

  public get user(): CUser {
    return new CUser(this.axios)
  }
}
