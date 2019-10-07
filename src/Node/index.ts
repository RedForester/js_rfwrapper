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
  public parent_node: CNodeWrapper | undefined = undefined;
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

  private children: CNodeWrapper[] = [];

  // PRIVATE
  private api: CApi;
  private axios: IAxios;

  /**
   * @description Класс для работы с узлом
   * @param params
   * @param id
   * @param node
   */
  constructor(params: IAxios, id?: string, node?: INodeInfo) {
    this.axios = params;
    this.api = new CApi(this.axios);
    if (id) {
      this.id = id;
      this.ready = this.init(true);
    } else if (node) {
        Object.assign(this, node);
        this.ready = this.init(false);

        this.children = node.body.children.map(
          child => new CNodeWrapper(this.axios, undefined, child)
        );
    } else {
      throw new Error(`Map ${id} cannot be load`);
    }
  }

  /**
   * @description Иницилизирует и загружает информацию о карте
   * @param update флаг о необходимости загрузки
   * @returns {Promise<CNodeWrapper>} загруженый класс
   */
  public async init(update: boolean): Promise<CNodeWrapper> {
    if (update) {
      // fixme: batch request
      const node = await this.api.node.get(this.id);

      // заполняем свойства у класса
      // warning: rewrite
      Object.assign(this, node);

      if (node.body.type_id) {
        this.body.type = await this.api.nodetype.get(node.body.type_id);
      }
    }

    return this;
  }

  public get "body.children"() {
    return this.children;
  }

  /**
   * @description Загрузка потомков если узел был создан по UUID
   * @returns {Promise<CNodeWrapper[]>} список узлов
   */
  public async getChildren(): Promise<CNodeWrapper[]> {
    const data = await this.api.map.getByLevelCount(this.map_id, this.id, 1);
    Object.assign(this, data);

    // подгружаем узлы
    this.children = this.body.children.map(
      child => new CNodeWrapper(this.axios, undefined, child)
    );
    
    return this.children;
  }

  /**
   * @description Поиск всех дочерних узлов по типу, условию, регулярке
   * @param {INodeFindOptions} options параметры поиска
   * @returns {INodeInfo[]}
   */
  public findAll(options: INodeFindOptions): INodeInfo[] {
    const dive = (nodes: INodeInfo[]): INodeInfo[] => {
      const result: INodeInfo[] = [];
      for (const child of nodes) {
        if (child.body.children) {
          Object.assign(result, dive(child.body.children || []));
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

    return dive(this.body.children);
  }

  /**
   * @description Позволяет находить первый поподающий под условия узел
   * @param options Параметры поиска по узлам
   * @returns {Promise<INodeInfo | boolean>} найденый узел или false если таких нету
   */
  public findOne(
    options: INodeFindOptions
  ): INodeInfo | boolean {
    const dive = (nodes: INodeInfo[]): INodeInfo | boolean => {
      for (const child of nodes) {
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

    return dive(this.body.children || []);
  }
}
