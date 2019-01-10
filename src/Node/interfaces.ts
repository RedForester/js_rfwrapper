/**
 * @description информация об узле
 */
export interface INodeInfo {
  id: string;
  map_id: string;
  parent: string;
  position: string[];
  access: string;
  originalParent: string;
  body: INodeBody;
  hidden: boolean;
  readers: string[];
  nodelevel: number;
  meta: any;
}

/**
 * @description Тело узла
 */
export interface INodeBody {
  id?: string;
  map_id: string;
  type_id: string;
  /**
   * @description добавляется при использовании врапера
   */
  type: INodeType;
  properties: any;
  parent: string;
  unread_comments_count: number;
  children: INodeInfo[];
  access: any;
  meta: any;
  comments_count: number;
}

/**
 * @description Параметры для поиска узлов
 */
export interface INodeFindOptions {
  /**
   * @description uuid типа узла который должен быть
   * @type {string}
   */
  typeid?: string;
  /**
   * @description регулярное выражение для поиска
   * @type {RegExp}
   * @example /{.d+}/
   */
  regex?: RegExp;
}

/**
 * @description информация об типе узла, добавляется дополнительно
 */
export interface INodeType {
  id: string;
  map_id: string;
  displayable: boolean;
  name: string;
  icon: string;
  default_child_node_type_id: string;
}
