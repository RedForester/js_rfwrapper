import { IAxios } from '../interfaces';
import CApi from '../Utils/api';
import { INodeInfo, INodeBody } from './interfaces';

export class CNodeWrapper {
  public ready: Promise<CNodeWrapper>;

  public id: string = '';
  public map_id: string = '';
  public parent: string = '';
  public position: string[] = [];
  public access: string = '';
  public originalParent: string = '';
  public hidden: boolean = false;
  public readers: string[] = [];
  public nodelevel: number = 0;
  public meta: object = {};
  public body?: INodeBody;

  // PRIVATE
  private api: CApi;

  /**
   * Класс для работы с узлом
   * @param params
   * @param id
   * @param node
   */
  constructor(params: IAxios, id?: string, node?: INodeInfo) {
    this.api = new CApi(params);
    if (id) {
      this.id = id;
      this.ready = this.init(true);
    } else if (node) {
      Object.assign(this, node);
      this.ready = this.init(false);
    } else {
      throw new Error('Cannot load Node');
    }
  }

  /**
   * Иницилизирует и загружает информацию о карте
   * @param update флаг о необходимости загрузки
   * @returns {Promise<CNodeWrapper>} загруженый класс
   */
  public async init(update: boolean) {
    if (update) {
      const data = await this.api.node.get(this.id);
      // заполняем свойства у класса
      // warning: rewrite
      Object.assign(this, data);
    }
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
  public async findAll(typeid: string, regex?: string): Promise<INodeInfo[]> {
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
