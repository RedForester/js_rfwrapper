/**
 * Создает класс для обработки событий, передается с необходимыми параметрами
 */
export default class Context {
  public what: {
    node_title: string;
    parent_title: string;
  };
  public type: string;
  public data: {
    node_title: string;
    parent_title: string;
  };
  public sessionId: string;
  public who: {
    id: string;
    username: string;
    is_extension_user: boolean;
  };

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
