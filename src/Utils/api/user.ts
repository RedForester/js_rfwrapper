import axios from 'axios';
import { IAxios, IUserInfo } from '../../interfaces';

export default class CUser {
  private axios: IAxios;

  constructor(params: IAxios) {
    this.axios = params;
  }

  /**
   * Получение информации об пользователе
   * @async
   * @param {string} userid uuid пользователя
   * @returns {Promise<any>} информация об пользователе
   */
  public async get(userid: string = 'self'): Promise<any> {
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
   * Обновление информации о пользователе
   * @param {any} body изменения
   * @return {Promise<any>}
   */
  public async update(body: any): Promise<any> {
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
