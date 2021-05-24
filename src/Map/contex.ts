/**
 * Создает класс для обработки событий, передается с необходимыми параметрами
 */
export class EventContext {
  public what: string;
  public type: string;
  public data:
    | IPropertiesDataEvent
    | IPropertiesDataEvent
    | INodeCopyedDataEvent
    | IEmptyDataEvent;
  public sessionId: string;
  public mapId: string;
  public who: {
    id: string;
    username: string;
    name?: string;
    surname?: string;
    avatar: string;
    is_extension_user: boolean;
  };

  /**
   * @param {object} event Новое событие
   */
  constructor(mapId: string, event: any) {
    this.what = event.what;
    this.type = event.type;
    this.data = event.data;
    this.sessionId = event.sessionId;
    this.who = event.who;
    this.mapId = mapId;
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

export interface INodeTypeDataEvent {
  name: string;
  icon?: string;
}

export interface IPropertiesChangesDataEvent {
  updated: Array<{
    group: string;
    key: string;
    old_type_id?: number;
    old_value: any;
    old_key?: string;
    type?: string;
    value: any;
  }>;
  created: Array<{
    group: string;
    key: string;
    value: any;
    type?: string;
  }>;
  deleted: Array<{
    group: string;
    key: string;
    value: any;
    type?: string;
  }>;
}

export interface IPropertiesDataEvent {
  node_title: string;
  node_type?: INodeTypeDataEvent;
  parent_title: string;
  properties: {
    byType?: IPropertiesChangesDataEvent;
    byUser?: IPropertiesChangesDataEvent;
    global?: IPropertiesChangesDataEvent;
    style?: IPropertiesChangesDataEvent;
  };
}

export interface IEmptyDataEvent {
  node_title: string;
  parent_title: string;
  node_type?: INodeTypeDataEvent;
}

export interface INodeCopyedDataEvent {
  node_title: string;
  parent_title: string;
  node_type?: INodeTypeDataEvent;
  map_id_from: string;
  node_id_from: string;
}
