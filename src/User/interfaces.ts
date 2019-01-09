/**
 * @description информация о пользователе
 */
export interface IUserInfo {
  /**
   * @description uuid пользователя
   */
  user_id: string;
  /**
   * @description ник пользователя
   */
  username: string;
  /**
   * @description имя пользователя
   */
  name?: string;
  /**
   * @description фамилия пользователя
   */
  surname?: string;
  /**
   * @description ссылка на аватарку пользователя
   */
  avatar?: string;
  /**
   * @description дата регистрации
   */
  registration_date: number;
  /**
   * @description день рождения
   */
  birthday: number;
  /**
   * @description список контактов
   */
  contacts?: IUserContacts[];
}

/**
 * @description информация о текущем пользователе
 */
export interface IUser {
  /**
   * @description uuid пользователя
   */
  user_id: string;
  /**
   * @description ник пользователя
   */
  username: string;
  /**
   * @description имя пользователя
   */
  name?: string;
  /**
   * @description фамилия
   */
  surname?: string;
  /**
   * @description аватар
   */
  avatar?: null;
  /**
   * @description дата регистрации пользователя
   */
  registration_date: string;
  /**
   * @description день рождения пользователя
   */
  birthday?: null;
  /**
   * @description список контактов
   */
  contacts?: IUserContacts;
  /**
   * @description uuid kv сессии
   */
  kv_session: string;
  /**
   * @description список сохраненых команд для пользователя
   */
  cmdBuffer?: any[];
  /**
   * @description пользовательские теги
   */
  tags?: IUserTagsItem[];
  /**
   * @description сохраненые пользовательские запросы
   */
  saved_search_queries?: IUserSavedSearchQueriesItem[];
}

interface IUserContacts {
  [k: string]: string;
}
interface IUserTagsItem {
  id: string;
  name: string;
  removable: boolean;
}
interface IUserSavedSearchQueriesItem {
  id: string;
  title: string;
  query: string;
  timestamp: number;
}
