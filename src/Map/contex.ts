/**
 * Создает класс для обработки событий, передается с необходимыми параметрами
 */
export default class {
  public what: any;
  public type: any;
  public data: any;
  public sessionId: any;
  public who: any;

  /**
   * @param {object} event Новое событие
   */
  constructor(event: any) {
    this.what = event.what;
    this.type = event.type;
    this.data = event.data;
    this.sessionId = event.sessionId;
    this.who = event.who;
  }

  // TODO: добавить методы для событий
}
