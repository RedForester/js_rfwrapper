import axios from 'axios';
import { IAxios } from '../../interfaces';
import { IUserInfo, IUser } from '../../User/interfaces';

export default class CUser {
  private axios: IAxios;

  constructor(params: IAxios) {
    this.axios = params;
  }

  /**
   * @description Получение информации об пользователе
   * @async
   * @param {string} userid uuid пользователя
   * @returns {Promise<any>} информация об пользователе
   */
  public async get(userid: string = 'self'): Promise<IUser> {
    try {
      let res;
      if (userid === 'self') {
        res = await axios(`/api/user`, this.axios);
        return res.data;
      }
      res = await axios(`/api/user/${userid}`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw new Error(err);
      }
      throw new Error(err.response.data);
    }
  }

  /**
   * @description Обновление информации о пользователе
   * @param {any} body изменения
   * @return {Promise<IUser>}
   */
  public async update(body: any): Promise<IUser> {
    try {
      const res = await axios.patch(`/api/user`, body, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response.data) {
        throw err;
      }
      throw err.response.data;
    }
  }
}
