import { IUserInfo } from '../Map/interface';
import { IUserContacts } from './interfaces';

/**
 * Создает класс пользователя
 */
export class CUserWrapper implements IUserInfo {
  public user_id: string = '';
  public username: string = '';
  public name: string = '';
  public surname: string = '';
  public avatar: string = '';
  public registration_date: number = 0;
  public birthday: number = 0;
  public contacts: IUserContacts = {};

  /**
   * @param id uuid пользователя
   */
  constructor(user: IUserInfo) {
    this.user_id = user.user_id;
    this.username = user.username;
    this.name = user.name || '';
    this.surname = user.surname || '';
    this.avatar = user.avatar || '';
    this.registration_date = user.registration_date;
    this.birthday = user.birthday;
    this.contacts = user.contacts || {};
  }
}
