import { IAxios, IParams } from './interfaces';
import { CMapWrapper } from './Map';
import { CNodeWrapper } from './Node';
import { INodeInfo, IMapInfo, IMapWrapperOptions } from './Map/interface';

export class Wrapper {
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
   * @description Создает экземпляр узла
   * @param {string} nodeid uuid узла
   * @returns {Promise<CNodeWrapper>}
   */
  public Node(id?: string, node?: INodeInfo): Promise<CNodeWrapper> {
    return new CNodeWrapper(this.axios, id, node).ready;
  }

  /**
   * @description Создает экземпляр карты
   * @param {string | IMapWrapperOptions} input ввод параметров
   */
  public Map(
    input: string | IMapInfo,
    options: IMapWrapperOptions = {}
  ): Promise<CMapWrapper> {
    return new CMapWrapper(this.axios, input, options).ready;
  }
}
