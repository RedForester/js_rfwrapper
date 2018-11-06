import CApi from '../api';
import { IAxios, INodeInfo } from '../interfaces';

export class CNodeWrapper {
  public ready: any;

  // node info
  public id: string;
  // noinspection TsLint
  public map_id: string = '';
  public parent: string = '';
  public position: string[] = [];
  public access: string = '';
  public originalParent: string = '';
  public hidden: boolean = false;
  public readers: string[] = [];
  public nodelevel: number = 0;
  public meta: object = {};

  // PRIVATE
  private api: CApi;
  private info!: any;

  /**
   * Класс для работы с узлом
   * @param {IAxios} params
   * @param {string} id uuid узла
   */
  constructor(params: IAxios, id: string) {
    this.api = new CApi(params);
    this.id = id;

    this.ready = this.init();
  }

  /**
   * Иницилизирует и загружает информацию о карте
   * @returns {Promise<CNodeWrapper>} загруженый класс
   */
  public async init() {
    const data = await this.api.node.get(this.id);
    // заполняем свойства у класса
    Object.assign(this, data);
    return this;
  }

  public async update(data: INodeInfo): Promise<CNodeWrapper> {
    // todo
    return this;
  }

  // Getters and Setters


}
