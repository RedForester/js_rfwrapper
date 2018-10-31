import CApi from '../api';
import { IAxios } from '../interfaces';
import Context from './contex';

export default class CMapWrapper {
  // для проверки того что карта готова
  public ready: Promise<any>;

  // uuid карты
  public id: string;
  private middlewares: any[]; // todo
  // для работы с апи внутри библеотеки
  private api: CApi;
  // для отслеживания статуса лонгпулинга
  private longpool: boolean = false;
  // информация о карте
  private info: any = {};

  constructor(params: IAxios, id: string) {
    this.api = new CApi(params);
    this.middlewares = [];

    this.id = id;
    this.ready = this.init();
  }

  /**
   * Добавление нового промежуточного обработчика
   * @param {Array < Function >} middlewares Обработчик
   * @returns {any}
   */
  public use(...middlewares: Function[]): any {
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
  public on(trigger: string, ...middlewares: Function[]): any {
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
  public async start(): Promise<any> {
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
        if (err.response) {
          // ошибка 408 -> переподключение, иначе останавливаем
          if (err.response.status !== 408) {
            this.longpool = false;
            throw new Error('longpolling: ' + err.response.statusText);
          }
        } else {
          this.longpool = false;
          throw new Error('longpolling: ' + err);
        }
      }
    }
  }

  /**
   * Иницилизирует и загружает информацию о карте
   */
  public async init() {
    this.info = await this.api.map.get(this.id);
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
}
