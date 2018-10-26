import axios from 'axios';
import {
  IAxios
} from '../interfaces';

export default class CNode {
  private axios: IAxios;

  constructor(params: IAxios) {
    this.axios = params;
  }
  /**
   * Получение информации об узле
   * @async
   * @param {string} nodeid uuid узла
   * @returns {Promise<any>} информация об узле
   */
  public async get(nodeid: string): Promise<any> {
    try {
      const res = await axios(`/api/nodes/${nodeid}`, this.axios)
      return res.data
    } catch (err) {
      if (!err.response) {
        throw err
      }
      throw err.response.data
    }
  }

  /**
   * Создание нового узла
   * @param {string} map_id uuid карты
   * @param {string} parent родитель узла
   * @param {string} position позиция относительно родителя
   * @param {string} properties свойства нового узла
   * @return {Promise<data>} результат
   */
  public async create(map_id: string, parent: string, {
    position = '["R",-1]',
    properties = {}
  }: any): Promise<any> {
    try {
      const res = await axios.post(`/api/nodes/`, {
        map_id,
        parent,
        position,
        properties: JSON.stringify(properties)
      }, this.axios)
      return res.data
    } catch (err) {
      if (!err.response) {
        throw err
      }
      throw err.response.data
    }
  }
}