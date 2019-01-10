import {
  version
} from "punycode";

/**
 * @description Используется для добавления нового пользователя
 */
export interface IMapAccessUser {
  access: any;
  nodeId: string;
  sendMail: boolean;
  username: string;
}

/**
 * @description Используется для добавления запроса в батч
 */
export interface IBatch {
  /**
   * @description http метод запроса
   */
  method: string;
  /**
   * @description ссылка запроса
   */
  url: string;
  /**
   * @description тело запроса; необходимо если POST запрос
   */
  body ? : string;
}

/**
 * @description Используется для получение значения одного из запросов
 */
export interface IBatchResult {
  /**
   * @description ответ на запрос
   */
  body: string;
  /**
   * @description http код результата
   */
  status: number;
}

/**
 * @description Найденое совпадение при поиске
 */
export interface ISearchHit {
  /**
   * @description Вес результата
   */
  score: number;
  /**
   * @description uuid узла
   */
  id: string;
  /**
   * @description uuid карты
   */
  map_id: string;
  /**
   * @description Заголовок узла
   */
  title: string;
  /**
   * @description Цвет узла
   */
  color: any;
  /**
   * @description Свойства у узла в которых было найдена фраза; запрос
   */
  props: any[];
  /**
   * @description Название типа узла
   */
  type: string;
  /**
   * @description uuid типа узла
   */
  type_id: string;
  /**
   * @description Время создание
   */
  timestamp: string;
  /**
   * @description Доступ к узлу
   */
  access: string[];
}

/**
 * @description Результат поиска по картам
 */
export interface ISearchResult {
  /**
   * @description Список узлов которые подходят под условие запроса
   */
  hits: ISearchHit[];
  /**
   * @description Оригинальный запрос
   */
  original_query: string;
}

/**
 * @description Последнее действие на карте, временая метка
 */
export interface IMapNotifLast {
  /**
   * @description метка времени когда произошло событие
   */
  value: string;
  /**
   * @description версия
   */
  version: string;
}

/**
 * @description Действие на карте
 */
export interface IMapNotif {
  /**
   * @description метки времени когда произошло событие
   */
  key: string[];
  /**
   * @description значение действия
   */
  value: {
    /**
     * @description uuid узла который создал событие
     */
    what: string;
    /**
     * @description тип события
     */
    type: string;
    /**
     * @description дополнительная информация
     */
    data: {
      /**
       * @description заголовок узла
       */
      node_title: string;
      /**
       * @description заголовок дочернего узла
       */
      parent_title: string;
    };
    /**
     * @description кто совершил событие
     */
    who: {
      /**
       * @description uuid пользователя
       */
      id: string;
      /**
       * @description почта пользователя
       */
      username: string;
      /**
       * @description имя пользователя
       */
      name: string;
      /**
       * @description пользователь является ли расширением
       */
      is_extension_user: boolean
    };
  };
}

/**
 * @description Содержит коды ошибок и текстовое описание для них
 */
export interface IExceptions {
  [k: string]: string;
}

export interface INodeTypeInfo {
  id: string;
  map_id: string;
  displayable: true;
  name: string;
  icon: string;
  default_child_node_type_id: string;
}