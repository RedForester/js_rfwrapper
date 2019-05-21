import { IAxios } from '../interfaces';
import { CApi } from '../Utils/api';
import {
  INodeInfo,
  INodeBody,
  INodeFindOptions,
  INodeType,
} from './interfaces';
import { type } from 'os';

export class CNodeWrapper implements INodeInfo {
  public ready: Promise<CNodeWrapper>;

  public id: string = '';
  public map_id: string = '';
  public parent: string = '';
  public position: any[] = [];
  public access: string = '';
  public originalParent: string = '';
  public hidden: boolean = false;
  public readers: string[] = [];
  public nodelevel: number = 0;
  public meta: object = {};
  public body: INodeBody = {
    id: '',
    map_id: '',
    type_id: '',
    type: {
      id: 'nontyped',
      map_id: '',
      displayable: true,
      name: 'nontyped',
      icon: '',
      default_child_node_type_id: '',
    },
    properties: null,
    parent: '',
    unread_comments_count: 0,
    children: [],
    access: null,
    meta: null,
    comments_count: 0,
  };

  // PRIVATE
  private api: CApi;

  /**
   * @description Класс для работы с узлом
   * @param params
   * @param id
   * @param node
   */
  constructor(params: IAxios, id?: string, node?: INodeInfo) {
    this.api = new CApi(params);
    if (id) {
      this.id = id;
      this.ready = this.init(true);
    } else {
      // fix: this
      if (node) {
        Object.assign(this, node);
        this.ready = this.init(false);
      } else {
        throw new Error(`Map ${id} cannot be load`);
      }
    }
  }

  /**
   * @description Иницилизирует и загружает информацию о карте
   * @param update флаг о необходимости загрузки
   * @returns {Promise<CNodeWrapper>} загруженый класс
   */
  public async init(update: boolean): Promise<CNodeWrapper> {
    if (update) {
      const data = await this.api.node.get(this.id);
      // заполняем свойства у класса
      // warning: rewrite
      Object.assign(this, data);

      if (data.body.type_id) {
        this.body.type = await this.api.nodetype.get(data.body.type_id);
      }
    }
    return this;
  }

  /**
   * @description Поиск всех дочерних узлов по типу, условию, регулярке
   * @param {INodeFindOptions} options параметры поиска
   * @returns {INodeInfo[]}
   */
  public async findAll(options: INodeFindOptions): Promise<INodeInfo[]> {
    const res = await this.api.map.getTree(this.map_id, this.id);

    const dive = async (nodes: INodeInfo[]): Promise<INodeInfo[]> => {
      const result: INodeInfo[] = [];
      for await (const child of nodes) {
        if (child.body.children) {
          Object.assign(result, await dive(child.body.children || []));
        }
        // указана регулярка для поиска но ничего не найдено
        if (
          options.regex &&
          !options.regex.test(child.body.properties.global.title)
        ) {
          continue;
        }

        // указан тип узла, но он не подходит
        if (options.typeid && options.typeid !== child.body.type_id) {
          continue;
        }

        result.push(child);
      }
      return result;
    };

    return dive(res.body.children || []);
  }

  /**
   * @description Позволяет находить первый поподающий под условия узел
   * @param options Параметры поиска по узлам
   * @returns {Promise<INodeInfo | boolean>} найденый узел или false если таких нету
   */
  public async findOne(
    options: INodeFindOptions
  ): Promise<INodeInfo | boolean> {
    const res = await this.api.map.getTree(this.map_id, this.id);

    const dive = async (nodes: INodeInfo[]): Promise<INodeInfo | boolean> => {
      for await (const child of nodes) {
        if (
          options.regex &&
          !options.regex.test(child.body.properties.global.title)
        ) {
          continue;
        }

        if (options.typeid && options.typeid !== child.body.type_id) {
          continue;
        }

        return child;
      }
      return false;
    };

    return dive(res.body.children || []);
  }
}
