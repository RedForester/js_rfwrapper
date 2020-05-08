export interface IExtCommandCtx {
  mapId: string;
  nodeId: string;
  userId: string;
  userToken: string;
  sessionId: string;
}

export interface IExtStore<T = any> {
  init(): Promise<void>;
  set(key: string, value: T): Promise<void>;
  get(key: string): Promise<T | undefined>;
  getAll(): Promise<T[]>;
  delete(key: string): Promise<void>;
}

export interface IExtentionOptions {
  /**
   * @description Уникальное название плагина, если плагина не существует с таким именем то будет созда новый
   */
  name: string;
  /**
   * @description Описание плагина, отображается при подключении плагина к карте
   */
  description?: string;
  /**
   * @description Адресс по которому находится плагин, неоходим для работы команд и регистрации плагина
   */
  baseUrl: string;
  /**
   * @description Почта, отображается в админке при подключении
   */
  email: string;
  /**
   * @description Хранилище токенов для карт
   */
  store?: IExtStore<string>;
  /**
   * @description Ссылка на rf с которым работает плагин прод/тест
   */
  rfBaseUrl?: string;
}
