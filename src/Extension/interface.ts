export interface ICommandOptions {
  id: string;
  name: string;
  description?: string;
  showRules?: ICommandShowRule[];
  requiredTypes?: ICommandRequiredType[];
}

export interface IRequiredTypeProp {
  name: string;
  argument:
    | 'NUMBER_INT'
    | 'NUMBER_REAL'
    | 'TEXT_SIMPLE'
    | 'TEXT_HTML'
    | 'TEXT_MARKDOWN'
    | 'DATETIME_DATE'
    | 'DATETIME_TIME'
    | 'DATETIME_ALL';
  category:
    | 'ANY'
    | 'NUMBER'
    | 'BOOLEAN'
    | 'TEXT'
    | 'DATE_TIME'
    | 'FILE'
    | 'USER'
    | 'ENUM';
}
export interface ICommandRequiredType {
  name: string;
  properties: IRequiredTypeProp[];
}

export interface ICommandShowRule {
  allNodes?: boolean;
  root?: boolean;
  selfType?: string;
  descendantOfType?: string;
}

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

export interface IExtUserInfo {
  username: string;
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
}

export interface IExtentionOptions {
  /**
   * @description Уникальное название плагина, если плагина не существует с таким именем то будет созда новый
   */
  name: string;
  /**
   * @description Параметры пользователя которые будут указаны у расширения
   */
  user: IExtUserInfo;
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

  /**
   * @description Необходимые типы узлов для работы плагина
   */
  requiredTypes?: ICommandRequiredType[];
}
