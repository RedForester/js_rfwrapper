import { IUserInfo, IUserInfoFromMap } from './interfaces';
import { CUserWrapper } from '.';

/**
 * Создает класс пользователя
 */
export class CMapUserWrapper extends CUserWrapper implements IUserInfoFromMap {
  // если получена информаци из карты (список пользователей)
  public map_id: string = '';
  public role: string = '';
  public can_export: boolean = false;
  public can_be_removed: boolean = false;
  public can_be_changed_by_role: boolean = false;
  public can_be_changed_export: boolean = false;
  public new_owner: boolean = false;

  /**
   * @param id uuid пользователя
   */
  constructor(user: IUserInfoFromMap) {
    super(user);

    this.map_id = user.map_id;
    this.role = user.role;
    this.can_export = user.can_export;
    this.can_be_removed = user.can_be_removed;
    this.can_be_changed_by_role = user.can_be_changed_by_role;
    this.can_be_changed_export = user.can_be_changed_export;
    this.new_owner = user.new_owner;
  }
}
