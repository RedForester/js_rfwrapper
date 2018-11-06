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
      let res;
      if (userid === 'self') {
        res = await axios(`/api/user`, this.axios);
        return res.data;
      }
      res = await axios(`/api/user/${userid}`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }

  /**
   * Обновление информации о пользователе
   * @param {any} body изменения
   * @return {Promise<object>}
   */
  public async update(body: any): Promise<object> {
    try {
      const res = await axios.post(`/api/user`, body, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response.data) {
        throw err;
      }
      throw err.response.data;
    }
  }
}
