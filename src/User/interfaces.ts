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
  contacts?: IUserContacts;
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
   * @description роль пользователя (при получении списка пользователей на карте)
   */
  role?: string;
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

export interface IUserContacts {
  [k: string]: string;
}
export interface IUserTagsItem {
  id: string;
  name: string;
  removable: boolean;
}
export interface IUserSavedSearchQueriesItem {
  id: string;
  title: string;
  query: string;
  timestamp: number;
}

/**
 * @description список пользователей и их права которые будут добавлены в узел
 */
export interface IAccessAddNewUser {
  /**
   * @description uuid пользователя который будет добавлен в узел
   */
  [s: string]: {
    /**
     * @description доступ к узлу
     */
    node?: string;
    /**
     * @description доступ к ветку
     */
    branch_in?: string;
    /**
     * @description права были удалены
     */
    revoked?: string;
  };
}
