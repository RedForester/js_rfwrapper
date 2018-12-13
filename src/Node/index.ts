import { IAxios, INodeInfo } from '../interfaces';
import CApi from '../Utils/api';

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
    // warning: rewrite
    Object.assign(this, data);
    return this;
  }

  public async update(data: INodeInfo): Promise<CNodeWrapper> {
    // todo
    return this;
  }

  /**
   * Поиск всех дочерних узлов по типу, условию, регулярке
   * @param {string} typeid uuid типа узла
   * @param {string} regex WIP регулрное условие для поиска по полям (Пользовательские, Типовые)
   */
  public async findAll(
    typeid: string,
    regex?: string
  ): Promise<INodeInfo[]> {
    const res = await this.api.map.getTree(this.map_id, this.id);

    const dive = async (nodes: INodeInfo[]): Promise<INodeInfo[]> => {
      const result: INodeInfo[] = [];

      for await (const child of nodes) {
        if (child.body.type_id === typeid) {
          result.push(child);
        } else {
          result.concat(await dive(child.body.children));
        }
      }

      return result;
    };

    return dive(res);
  }
}
