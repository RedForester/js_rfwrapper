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
import { CUserWrapper } from '../User';
import { CMapUserWrapper } from '../User/mapuser';
import { IUserInfoFromMap } from '../User/interfaces';
import { IMapNotifLast } from '../Utils/api/interfaces';

export type IEventCallback = (context: Context, cb: () => void) => void;

export class CMapWrapper implements IMapWrapper {
  /**
   * @description Получить массив загруженых узлов для данной карты
   * @returns {INodeInfo[]}
   */
  public get childrens(): INodeInfo[] {
    return this.nodes;
  }
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
  public users: CMapUserWrapper[] = [];
  public tree: INodeInfo[] = [];
  // для отслеживания статуса лонгпулинга
  public longpool: boolean;

  /*
    Private
  */
  private middlewares: any[]; // todo
  // для работы с апи внутри библеотеки
  private api: CApi;
  // для хранения настроек
  private axios: IAxios;
  // список загруженых узлов в виде дерева
  private nodes: INodeInfo[] = [];
  // (виртуальная) начальная точка просмотра карты
  private viewport: string;
  // загружать ли дерево
  private loadmap: boolean;

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
    this.loadmap = options.loadmap ? true : false;
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

      const users = await this.api.map.users(this.id);
      this.users = users.map(
        (user: IUserInfoFromMap) => new CMapUserWrapper(user)
      );
    }
    await this.make_tree(this.viewport || this.root_node_id);

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
  public on(trigger: string, ...middlewares: IEventCallback[]): CMapWrapper {
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

    let lastNotify = await this.api.global.mapNotifLast(
      this.id,
      user.kv_session
    );

    this.safeLoop(async () => {
      const nextNotify = await this.waitNextNotify(user.kv_session, lastNotify);

      if (nextNotify !== null && nextNotify !== lastNotify) {
        const events = await this.api.global.mapNotif(
          this.id,
          user.kv_session,
          lastNotify.value || '0',
          nextNotify.value || '0'
        );

        for (const event of events) {
          await this.next(new Context(this.id, event.value), this);
        }

        lastNotify = nextNotify;
      }
    });

    return this;
  }

  /**
   * @description Последовательно переключает обработчики
   * @param {Context} ctx Содержит new Context
   * @param {number} idx Порядковый номер обработчика
   * @returns {any} Переключение на новый обработчик
   */
  public async next(
    ctx: Context,
    map: CMapWrapper,
    idx: number = -1
  ): Promise<any> {
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
   * @description Поиск пользователй карты по uuid
   * @param {String} id uuid пользователя
   * @returns {CMapUserWrapper | undefined}
   */
  public find_by_id(id: string): CMapUserWrapper | undefined {
    return this.users.find((u: CMapUserWrapper) => u.user_id === id);
  }

  /**
   * @description Поиск пользователя по его нику (почте)
   * @param {String} username Никнейм пользователя (почта)
   * @returns {CMapUserWrapper | undefined}
   */
  public find_by_username(username: string): CMapUserWrapper | undefined {
    return this.users.find((u: CMapUserWrapper) => u.username === username);
  }

  /**
   * @description Получить узел карты по его id
   * @param id
   */
  public get(id: string): CNodeWrapper | undefined {
    const node = this.nodes.find((n: INodeInfo) => n.id === id);
    if (!node) {
      return undefined;
    }

    // Создает класс узла путем указания его тела
    return new CNodeWrapper(this.axios, undefined, node);
  }

  /**
   * @description Загружает карту и узлы от указаного узла
   * @param {string} viewport узел который будет началом
   */
  private async make_tree(viewport: string): Promise<CMapWrapper> {
    if (!this.loadmap) {
      return this;
    }

    const res = await this.api.map.getTree(this.id, viewport);

    this.tree = res.body.children;

    /**
     * @description Функция для обхода всех узлов в дереве
     * @param nodes список узолов
     */
    const dive = async (nodes: INodeInfo[]) => {
      for await (const child of nodes) {
        await dive(child.body.children || []);
        this.nodes.push(new CNodeWrapper(this.axios, undefined, child));
      }
    };

    await dive(res.body.children || []);
    return this;
  }

  private async safeLoop(fn: () => Promise<void>) {
    while (this.longpool === true) {
      try {
        await fn();
      } catch (e) {
        if ('Timeout' in e) {
          this.longpool = false;
          throw new Error('longpolling: ' + e);
        }
      }
    }
  }

  private async waitNextNotify(
    kv_session: string,
    lastNotify: IMapNotifLast
  ): Promise<IMapNotifLast | null> {
    try {
      return await this.api.global.mapNotifLast(
        this.id,
        kv_session,
        lastNotify.version
      );
    } catch (e) {
      if (e === 'Timeout') {
        return null;
      }
      throw e;
    }
  }
}
