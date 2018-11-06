import CApi from '../api';
import { IAxios, IMapRole, INodeInfo, IUserInfo } from '../interfaces';
import { CNodeWrapper } from '../Node';
import Context from './contex';

export class CMapWrapper {
  // для проверки того что карта готова
  public ready: Promise<CMapWrapper>;

  // map info
  public id: string;
  public name: string = '';
  public accessed: string = '';
  public layout: string = '';
  // noinspection TsLint
  public node_count: number = 0;
  // noinspection TsLint
  public user_count: number = 0;
  public objid: string = '';
  public owner: string = '';
  // noinspection TsLint
  public owner_avatar: string = '';
  // noinspection TsLint
  public owner_name: string = '';
  public public: string = '';
  public role: IMapRole[] = [];
  // noinspection TsLint
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
  private longpool: boolean = false;
  // информация о карте
  private info: any = {};

  /**
   * Создает экземпляр класса CMapWrapper
   * @param params параметры для работы axios
   * @param id uuid карты с которой будем работать
   */
  constructor(params: IAxios, id: string) {
    this.api = new CApi(params);
    this.axios = params;
    this.middlewares = [];

    this.id = id;
    this.ready = this.init();
  }

  /**
   * Иницилизирует и загружает информацию о карте
   */
  public async init(): Promise<CMapWrapper> {
    const data = await this.api.map.get(this.id);

    // заполняем свойства у класса
    Object.assign(this, data);

    this.start();
    return this;
  }

  /**
   * Создание нового узла
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
   * Добавление нового промежуточного обработчика
   * @param {Array < Function >} middlewares Обработчик
   * @returns {any}
   */
  public use(...middlewares: any[]): CMapWrapper {
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
   * Используется для создания LongPoll соединения с RFKV
   * @async
   * @returns {Promise<any>} Возвращяет промис
   */
  public async start(): Promise<CMapWrapper> {
    // если карта загрузилась то продолжаем
    await this.ready;

    const user: any = await this.api.user.get();

    this.longpool = true;
    let version = 0;
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
}
