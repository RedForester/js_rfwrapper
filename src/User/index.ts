import { IUserInfo } from "../Map/interface";

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
    public contacts: string[] = [];

    /**
     * @param id uuid пользователя
     */
    constructor(user: IUserInfo) {
        Object.assign(this, user);
    }
}