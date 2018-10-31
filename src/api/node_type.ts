import axios from 'axios';
import { IAxios } from '../interfaces';

export default class CNodeType {
  private axios: IAxios;

  constructor(params: IAxios) {
    this.axios = params;
  }
  /**
   * Информация об типе узла
   * @async
   * @param {string} nodetypeid uuid типа узла
   * @return {Promise<any>} результат
   */
  public async get(nodetypeid: string): Promise<any> {
    try {
      const res = await axios(`/api/node_types/${nodetypeid}`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }

  /**
   * Создание нового типа
   * @async
   * @returns {Promise} результат
   */
  // TODO:
  public async create(): Promise<any> {
    try {
      const res = await axios.post(`/api/node_types`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }
}
