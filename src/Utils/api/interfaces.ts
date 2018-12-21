// интерфейсы для работы с api
/**
 * Используется для добавления нового пользователя
 */
export interface IMapAccessUser {
  access: any;
  nodeId: string;
  sendMail: boolean;
  username: string;
}
