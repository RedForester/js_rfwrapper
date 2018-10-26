import axios from 'axios';
import { IAxios } from '../interfaces';

export default class CUser {
  private axios: IAxios;

  constructor(params: IAxios) {
    this.axios = params;
  }

  /**
   * Получение информации об пользователе
   * @async
   * @param {string} userid uuid пользователя
   * @returns {Promise<object>} информация об пользователе
   */
  public async get(userid: string = 'self'): Promise<object> {
    try {
      if (userid === 'self') {
        const res = await axios(`/api/user`, this.axios);
        return res.data;
      }
      const res = await axios(`/api/user/${userid}`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }
}
