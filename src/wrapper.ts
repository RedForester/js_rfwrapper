import { IAxios, IParams } from './interfaces';
import { CMapWrapper } from './Map';
import { CNodeWrapper } from './Node';

export default class Wrapper {
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
