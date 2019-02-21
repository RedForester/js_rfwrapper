import { IAxios } from '../interfaces';
import { CNodeWrapper } from '../Node';
import { CApi } from '../Utils/api';
import Context from './contex';
import {
  IMapRole,
  INodeInfo,
  IUserInfo,
  IMapWrapperOptions,
  IMapWrapper,
  IMapInfo,
} from './interface';

export class CMapWrapper implements IMapWrapper {
  // для проверки того что карта готова
  public ready: Promise<CMapWrapper>;

  // map info
  public id: string = '';
  public name: string = '';
  public accessed: string = '';
  public layout: string = '';
  public node_count: number = 0;
  public user_count: number = 0;
  public objid: string = '';
  public owner: string = '';
  public owner_avatar: string = '';
  public owner_name: string = '';
  public public: boolean = false;
  public role: IMapRole | IMapRole[] = [];
  public root_node_id: string = '';
  public users: IUserInfo[] = [];

  /*
    Private
  */
  private middlewares: any[]; // todo
  // для работы с апи внутри библеотеки
  private api: CApi;
  // для хранения настроек
  private axios: IAxios;
  // для отслеживания статуса лонгпулинга
  private longpool: boolean;
  // список загруженых узлов в виде дерева
  private nodes: INodeInfo[] = [];

  private viewport: string;

  /**
   * @description Создает экземпляр класса CMapWrapper
   * @param {IAxios} params параметры для работы axios
   * @param {string} id uuid карты с которой будем работать
   * @param {IMapInfo} map информация о карте
   * @param {CNodeWrapper} loadmap загружать карту в виде CNodeWrapper
   * @param {string} viewport
   */
  constructor(
    params: IAxios,
    input: string | IMapInfo,
    options: IMapWrapperOptions
  ) {
    this.api = new CApi(params);
    this.axios = params;
    this.middlewares = [];
    this.longpool = options.enablePolling || false;

    this.viewport = options.viewport || '';

    if (typeof input === 'string') {
      this.id = input;
      this.ready = this.init(true);
    } else {
      // fixme: this
      if (input) {
        Object.assign(this, input);
        this.ready = this.init(false);
      } else {
        throw new Error(`Map cannot be load`);
      }
    }
  }

  /**
   * @description Иницилизирует и загружает информацию о карте
   * @param {boolean} loadtree загрузить узлы карты
   * @param {string} viewport загрузить дерево узлов от указаного узла
   */
  public async init(update?: boolean): Promise<CMapWrapper> {
    if (update) {
      Object.assign(this, await this.api.map.get(this.id));
    }
    await this.make_tree(this.viewport || this.root_node_id);

    this.start();
    return this;
  }

  /**
   * @description Создание нового узла
   * @param {string} nodeid uuid узла, если не указан то создается от корня карты
   * @param {INodeInfo} data данные будут добавлены при создании карты
   */
  public async create(
    nodeid: string = this.root_node_id,
    data?: INodeInfo
  ): Promise<CNodeWrapper> {
    const node = await this.api.node.create(this.id, nodeid, {});
    return new CNodeWrapper(this.axios, node.id).ready;
  }

  /**
   * @description Подписка на события названию события
   * @param {string} trigger
   * @param {Array < Function >} middlewares
   */
  public on(trigger: string, ...middlewares: any[]): CMapWrapper {
    const idx = this.middlewares.length;
    middlewares.forEach(fn => {
      this.middlewares.push({
        fn: (ctx: Context) => fn(ctx, () => this.next(ctx, this, idx)),
        trigger,
      });
    });

    return this;
  }

  /**
   * @description Используется для создания LongPoll соединения с RFKV
   * @async
   * @returns {Promise<any>} Возвращяет промис
   */
  public async start(): Promise<CMapWrapper> {
    // если карта загрузилась то продолжаем
    await this.ready;

    const user: any = await this.api.user.get();

    let version = '';
    let lastevent = '';

    while (this.longpool === true) {
      try {
        const newevent = await this.api.global.mapNotifLast(
          this.id,
          user.kv_session,
          version
        );
        if (lastevent === '') {
          lastevent = newevent.value;
          version = newevent.version;
        } else {
          const events = await this.api.global.mapNotif(
            this.id,
            user.kv_session,
            lastevent,
            newevent.value
          );

          version = newevent.version;
          lastevent = newevent.value;

          events.forEach((event: any) => {
            this.next(new Context(event.value), this);
          });
        }
      } catch (err) {
        if (err !== 'Timeout') {
          // ошибка 408 -> переподключение, иначе останавливаем
          this.longpool = false;
          throw new Error('longpolling: ' + err);
        }
      }
    }

    return this;
  }

  /**
   * @description Получить массив загруженых узлов для данной карты
   * @returns {INodeInfo[]}
   */
  public get tree(): INodeInfo[] {
    return this.nodes;
  }

  /**
   * @description Последовательно переключает обработчики
   * @param {Context} ctx Содержит new Context
   * @param {number} idx Порядковый номер обработчика
   * @returns {any} Переключение на новый обработчик
   */
  public next(ctx: Context, map: CMapWrapper, idx: number = -1): any {
    // todo
    if (this.middlewares.length > idx + 1) {
      const { fn, trigger } = this.middlewares[idx + 1];

      if (trigger === ctx.type || trigger === '*') {
        return fn(ctx);
      } else if (!trigger) {
        return fn(ctx);
      }

      return this.next(ctx, map, idx + 1);
    }
  }

  /**
   * @description Загружает карту и узлы от указаного узла
   * @param {string} viewport узел который будет началом
   */
  private async make_tree(viewport: string): Promise<CMapWrapper> {
    const res = await this.api.map.getTree(this.id, viewport);

    /**
     * @description Функция для обхода всех узлов в дереве
     * @param nodes список узолов
     */
    const dive = async (nodes: INodeInfo[]) => {
      for await (const child of nodes) {
        await dive(child.body.children || []);
        this.nodes.push(child);
      }
    };
    
    await dive(res.body.children || []);
    return this;
  }
}
