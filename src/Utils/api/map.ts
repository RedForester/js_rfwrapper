import axios from 'axios';
import { IAxios } from '../../interfaces';
import { IMapAccessUser } from './interfaces';
import { IMapInfo } from '../../Map/interface';

export default class CMap {
  private axios: IAxios;

  constructor(params: IAxios) {
    this.axios = params;
  }
  /**
   * Получение информации об карте
   * @param {string} mapid uuid карты
   * @return {Promise<any>} Информация об карте
   */
  public async get(mapid: string): Promise<IMapInfo> {
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

  public async delete(mapid: string): Promise<any> {
    try {
      const res = await axios.delete(`/api/maps/${mapid}`, this.axios);
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
   * @return {Promise<any>} Информация об карте
   */
  public async update(mapid: string, body: any): Promise<any> {
    try {
      const res = await axios.patch(`/api/maps/${mapid}`, body, this.axios);
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
    levelCount: number = 5
  ): Promise<any> {
    try {
      let res;
      if (nodeid !== '') {
        res = await axios(
          `/api/maps/${mapid}/nodes/level_count/${levelCount}`,
          this.axios
        );
        return res.data;
      }
      res = await axios(`/api/maps/${mapid}/nodes/${nodeid}`, this.axios);
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
      const res = await axios.post(`/api/maps/${mapid}/request_access`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response || !err.response.data) {
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
  public async create(name: string = 'New map'): Promise<IMapInfo> {
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
      const res = await axios.get(`/api/maps/${mapid}/users`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }

  /**
   * Добавляет на карту нового пользоавтеля с указаными правами
   * @param mapid
   * @param access
   * @param nodeId
   * @param sendMail
   * @param username
   */
  public async addUser(
    mapid: string,
    { access, nodeId, sendMail = true, username }: IMapAccessUser
  ): Promise<any> {
    try {
      const res = await axios.post(
        `/api/maps/${mapid}/users`,
        {
          username,
          sendMail,
          nodeId,
          access,
        },
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
}
