import CApi from '../api';
import { IAxios, IMapRole, IUserInfo, INodeInfo } from '../interfaces';
import Context from './contex';
import { CNodeWrapper } from '../Node';

export default class CMapWrapper {
  // для проверки того что карта готова
  public ready: Promise<CMapWrapper>;

  // map info
  public id: string;

  /*
    Private
  */
  private middlewares: any[]; // todo
  // для работы с апи внутри библеотеки
  private api: CApi;
  // для хранения настроек
  private axios: IAxios;
  // для отслеживания статуса лонгпулинга
  private longpool: boolean = false;
  // информация о карте
  private info: any = {};

  constructor(params: IAxios, id: string) {
    this.api = new CApi(params);
    this.axios = params;
    this.middlewares = [];

    this.id = id;
    this.ready = this.init();
  }

  /**
   * Создание нового узла
   * @param {string} nodeid uuid узла, если не указан то создается от корня карты
   * @param {INodeInfo} data данные будут добавлены при создании карты
   */
  public async create(nodeid: string = this.root_node_id, data?: INodeInfo): Promise<CNodeWrapper> {
    const node = await this.api.node.create(this.id, nodeid, {})
    return new CNodeWrapper(this.axios, node.id).ready
  }

  /**
   * Добавление нового промежуточного обработчика
   * @param {Array < Function >} middlewares Обработчик
   * @returns {any}
   */
  public use(...middlewares: Function[]): CMapWrapper {
    const idx = this.middlewares.length;
    middlewares.forEach(fn => {
      this.middlewares.push({
        fn: (ctx: Context) => fn(ctx, () => this.next(ctx, this, idx)),
      });
    });

    return this;
  }

  /**
   * Подписка на события названию события
   * @param {string} trigger
   * @param {Array < Function >} middlewares
   */
  public on(trigger: string, ...middlewares: Function[]): CMapWrapper {
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
   * Используется для создания LongPoll соединения с RFKV
   * @async
   * @returns {Promise<any>} Возвращяет промис
   */
  public async start(): Promise<CMapWrapper> {
    await this.ready;
    const user: any = await this.api.user.get();
    this.longpool = true;
    let version = 0,
      lastevent = '';

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
   * Иницилизирует и загружает информацию о карте
   */
  public async init(): Promise<CMapWrapper> {
    this.info = await this.api.map.get(this.id);
    this.start()
    return this;
  }

  /**
   * Последовательно переключает обработчики
   * @param {Context} ctx Содержит new Context
   * @param {number} idx Порядковый номер обработчика
   * @returns {any} Переключение на новый обработчик
   */
  private next(ctx: Context, map: CMapWrapper, idx: number = -1): any {
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

  /*
    Getters and Setters
  */
  get name(): string {
    return this.info.name
  }
  get accessed(): string {
    return this.info.accessed
  }
  get layout(): string {
    return this.info.layout
  }
  get node_count(): number {
    return this.info.node_count
  }
  get user_count(): number {
    return this.info.user_count
  }
  get objid(): string {
    return this.info.objid
  }
  get owner(): string {
    return this.info.owner
  }
  get owner_avatar(): string {
    return this.info.owner_avatar
  }
  get owner_name(): string {
    return this.info.owner_name
  }
  get public(): string {
    return this.info.public
  }
  get role(): Array<IMapRole> {
    return this.info.role
  }
  get root_node_id(): string {
    return this.info.root_node_id
  }
  get users(): Array<IUserInfo> {
    return this.info.users
  }
}
