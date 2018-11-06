import CGlobal from './api/global';
import CMap from './api/map';
import CNode from './api/node';
import CNodeType from './api/node_type';
import CUser from './api/user';
import { IAxios, IParams } from './interfaces';

import { CMapWrapper } from './Map';
import { CNodeWrapper } from './Node';

/**
 * Модуль для работы только с API RF
 */
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

export class wrapper {
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
      baseURL: this.settings.host || 'http://app.redforester.com',
      responseType: 'json',
    };
  }

  /**
   * Создает экземпляр узла
   * @param {string} nodeid uuid узла
   * @returns {Promise<CNodeWrapper>}
   */
  public Node(id: string): Promise<CNodeWrapper> {
    return new CNodeWrapper(this.axios, id).ready;
  }

  /**
   * Создает экземпляр карты
   * @param {string} mapid uuid карты
   * @returns {Promise<CMapWrapper>}
   */
  public Map(id: string): Promise<CMapWrapper> {
    return new CMapWrapper(this.axios, id).ready;
  }
}
