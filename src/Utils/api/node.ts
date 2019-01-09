import axios from 'axios';
import { IAxios } from '../../interfaces';
import { INodeInfo } from '../../Map/interface';

export default class CNode {
  private axios: IAxios;

  constructor(params: IAxios) {
    this.axios = params;
  }

  /**
   * @description Получение информации об узле
   * @async
   * @param {string} nodeid uuid узла
   * @returns {Promise<any>} информация об узле
   */
  public async get(nodeid: string): Promise<INodeInfo> {
    try {
      const res = await axios.get(`/api/nodes/${nodeid}`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }

  /**
   * @description Обновление информации об узле
   * @async
   * @param {string} nodeid uuid узла
   * @param {any} body
   * @returns {Promise<any>} информация об узле
   */
  public async update(nodeid: string, body: any): Promise<any> {
    try {
      const res = await axios.patch(`/api/nodes/${nodeid}`, body, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }

  /**
   * @description Удаление узла
   * @async
   * @param {string} nodeid uuid узла
   * @returns {Promise<any>} информация об узле
   */
  public async delete(nodeid: string): Promise<any> {
    try {
      const res = await axios.delete(`/api/nodes/${nodeid}`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }

  /**
   * @description Создание нового узла
   * @param {string} map_id uuid карты
   * @param {string} parent родитель узла
   * @param {string} position позиция относительно родителя
   * @param {string} properties свойства нового узла
   * @return {Promise<data>} результат
   */
  public async create(
    map_id: string,
    parent: string,
    { position = '["R",-1]', properties = {} }: any
  ): Promise<any> {
    // todo: добавить интерфейс и обязательно добавлять пустые поля style byType byUser
    try {
      const res = await axios.post(
        `/api/nodes`,
        {
          map_id,
          parent,
          position,
          properties: JSON.stringify(properties),
        },
        this.axios
      );
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }
}
