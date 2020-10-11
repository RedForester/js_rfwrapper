import axios from 'axios';
import { IAxios } from '../../interfaces';
import { json } from 'express';

export interface ICommand {
  name: string;
  type: {
    action?: string;
    url?: string;
  };
  description?: string;
  showRules: Array<{
    allNodes?: boolean;
    root?: boolean;
    selfType?: string;
    descendantOfType?: string;
  }>;
}

export interface IExtention {
  id?: string; // todo: разделить интерфейсы и вынести от сюда
  name: string;
  description?: string;
  baseUrl: string;
  email: string;
  published?: boolean;
  requiredTypes: Array<{
    name: string;
    properties: Array<{
      name: string;
      category: string;
      argument: string;
    }>;
  }>;
  commands: ICommand[];
}

export default class CExtentionAPI {
  private axios: IAxios;

  constructor(params: IAxios) {
    this.axios = params;
  }

  /**
   * @description Получить список расширений которые загеристрировал пользователь
   * @async
   * @returns {Promise<IExtention[]>} список всех плагинов которые пользователь зарегистрировал
   */
  public async getOwned(): Promise<IExtention[]> {
    try {
      const res = await axios(`/api/extensions/owned`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw new Error(err);
      }
      throw new Error(JSON.stringify(err.response.data));
    }
  }

  /**
   * @description Обновляет схему плагина по его uuid
   * @async
   * @returns {Promise<IExtention>} информация об плагине
   */
  public async update(id: string, body: object): Promise<IExtention> {
    try {
      const res = await axios.patch(`/api/extensions/${id}`, body, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw new Error(err);
      }
      throw new Error(JSON.stringify(err.response.data));
    }
  }

  /**
   * @description Создает плагин
   * @async
   * @returns {Promise<IExtention>} информация об плагине
   */
  public async create(body: object): Promise<IExtention> {
    try {
      const res = await axios.post(`/api/extensions`, body, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw new Error(err);
      }
      throw new Error(JSON.stringify(err.response.data));
    }
  }
}
