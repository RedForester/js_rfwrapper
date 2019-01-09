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
  body?: string;
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
   * @description Свойства у узла в которых было найдена фраза, запрос
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