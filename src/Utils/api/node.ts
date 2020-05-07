import axios from 'axios';
import { IAxios } from '../../interfaces';
import { INodeInfo } from '../../Map/interface';
import { INodeBody } from '../../Node/interfaces';
import { IAccessAddNewUser } from '../../User/interfaces';

export default class CNode {
  private axios: IAxios;

  constructor(params: IAxios) {
    this.axios = params;
  }

  /**
   * @description
   * @param nodeid uuid узла
   * @param content комментарий
   * @param reply_to параметры доступа
   */
  public async addComment(nodeid: string, content: string, reply_to?: string) {
    try {
      const res = await axios.post(
        `/api/nodes/${nodeid}/comments`,
        { content, reply_to },
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

  /**
   * @description
   * @param nodeid uuid узла
   * @param access параметры доступа
   */
  public async addAccess(nodeid: string, access: IAccessAddNewUser) {
    try {
      const res = await axios.patch(
        `/api/nodes/${nodeid}/access`,
        {
          access,
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

  /**
   * @description
   * @param {string} nodeid uuid узла
   */
  public async access(nodeid: string) {
    try {
      const res = await axios.get(`/api/nodes/${nodeid}/access`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
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
   * @returns {Promise<INodeInfo>} информация об узле
   */
  public async update(nodeid: string, body: any): Promise<INodeInfo> {
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
  ): Promise<INodeInfo> {
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
