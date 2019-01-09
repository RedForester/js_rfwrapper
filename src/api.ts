import { IAxios, IParams } from './interfaces';
import CGlobal from './Utils/api/global';
import CMap from './Utils/api/map';
import CNode from './Utils/api/node';
import CNodeType from './Utils/api/node_type';
import CUser from './Utils/api/user';

/**
 * Модуль для работы только с API RF
 */
export class Api {
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
      baseURL: this.settings.host || 'http://app.redforester.com/',
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
    return new CNode(this.axios);
  }

  public get nodetype(): CNodeType {
    return new CNodeType(this.axios);
  }

  public get user(): CUser {
    return new CUser(this.axios);
  }
}
