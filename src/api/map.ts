import axios from 'axios';
import { IAxios } from '../interfaces';

export default class CMap {
  private axios: IAxios;

  constructor(params: IAxios) {
    this.axios = params;
  }
  /**
   * Получение информации об карте
   * @param {string} mapid uuid карты
   * @return {Promise<object>} Информация об карте
   */
  public async get(mapid: string): Promise<object> {
    try {
      const res = await axios(`/api/maps/${mapid}`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response.data) {
        throw err;
      }
      throw err.response.data;
    }
  }

  /**
   * Обновление информации об карте
   * @param {string} mapid uuid карты
   * @param {any} body изменения
   * @return {Promise<object>} Информация об карте
   */
  public async update(mapid: string, body: any): Promise<object> {
    try {
      const res = await axios.post(`/api/maps/${mapid}`, body, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response.data) {
        throw err;
      }
      throw err.response.data;
    }
  }

  /**
   * Получение всех типов узла
   * @param {string} mapid uuid карты
   * @return {Promise<any>} Список типов
   */
  public async getTypes(mapid: string): Promise<any> {
    try {
      const res = await axios(`/api/maps/${mapid}/node_types`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response.data) {
        throw err;
      }
      throw err.response.data;
    }
  }

  /**
   * Получение дерева узлов
   * @async
   * @param {string} mapid uuid карты
   * @param {string} nodeid uuid узла, если не указан то от начала карты
   * @param {number} level_count максимальная глубина при получении узлов
   * @return {Promise<any>} Дерево узлов
   */
  public async getTree(
    mapid: string,
    nodeid: string = '',
    level_count: number = 5
  ): Promise<any> {
    try {
      if (nodeid !== '') {
        const res = await axios(
          `/api/maps/${mapid}/nodes/level_count/${level_count}`,
          this.axios
        );
        return res.data;
      }
      const res = await axios(`/api/maps/${mapid}/nodes/${nodeid}`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response.data) {
        throw err;
      }
      throw err.response.data;
    }
  }

  /**
   * Запрос доступа к карте
   * @async
   * @param {string} mapid uuid карты
   * @return {Promise<any>} JSON
   */
  public async requestAccess(mapid: string): Promise<any> {
    try {
      const res = await axios.post(
        `/api/maps/${mapid}/request_access`,
        this.axios
      );
      return res.data;
    } catch (err) {
      if (!err.response.data) {
        throw err;
      }
      throw err.response.data;
    }
  }

  // FIX: исправить, неработает
  /**
   * Создание новой карты
   * @async
   * @param {string} name название карты
   * @return {Promise<any>} Информация об карте
   */
  public async create(name: string = 'New map'): Promise<any> {
    try {
      const res = await axios.post(
        `/api/maps`,
        {
          name,
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
   * Получение списка пользователей на карте
   * @async
   * @param {string} mapid uuid карты
   * @return {Promise<any>} JSON
   */
  public async users(mapid: string): Promise<any> {
    try {
      const res = await axios.post(`/api/maps/${mapid}/users`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }
}
