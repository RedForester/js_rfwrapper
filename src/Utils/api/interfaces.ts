// интерфейсы для работы с api
/**
 * Используется для добавления нового пользователя
 */
export interface IMapAccessUser {
  access: object;
  nodeId: string;
  sendMail: boolean;
  username: string;
}
