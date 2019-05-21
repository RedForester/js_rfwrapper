/**
 * Создает класс для обработки событий, передается с необходимыми параметрами
 */
export default class Context {
  public what: string;
  public type: string;
  public data:
    | IPropertiesDataEvent
    | IPropertiesDataEvent
    | INodeCopyedDataEvent
    | IEmptyDataEvent;
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

export interface ICommentDataEvent {
  author: string;
  content: string;
  id: string;
  node: string;
  timestamp: string;
  node_title: string;
  parent_title: string;
}

export interface IPropertiesDataEvent {
  node_title: string;
  parent_title: string;
  changes: {
    type_id?: string;
    properties?: string;
  };
}

export interface IEmptyDataEvent {
  node_title: string;
  parent_title: string;
}

export interface INodeCopyedDataEvent {
  node_title: string;
  parent_title: string;
  map_id_from: string;
  node_id_from: string;
}
