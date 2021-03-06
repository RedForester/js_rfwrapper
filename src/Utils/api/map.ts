import axios from 'axios';
import { IAxios } from '../../interfaces';
import { IMapAccessUser, INodeTypeInfo } from './interfaces';
import { IMapInfo, INodeInfo, IUserInfo } from '../../Map/interface';
import { IUserInfoFromMap } from '../../User/interfaces';

export default class CMap {
  private axios: IAxios;

  constructor(params: IAxios) {
    this.axios = params;
  }
  /**
   * @description Получение информации об карте
   * @param {string} mapid uuid карты
   * @return {Promise<IMapInfo>} Информация об карте
   */
  public async get(mapid: string): Promise<IMapInfo> {
    try {
      const res = await axios(`/api/maps/${mapid}`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw new Error(err);
      }
      throw new Error(JSON.stringify(err.response.data));
    }
  }

  public async delete(mapid: string): Promise<any> {
    try {
      const res = await axios.delete(`/api/maps/${mapid}`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw new Error(err);
      }
      throw new Error(JSON.stringify(err.response.data));
    }
  }

  /**
   * @description Обновление информации об карте
   * @param {string} mapid uuid карты
   * @param {any} body изменения
   * @return {Promise<IMapInfo>} Информация об карте
   */
  public async update(mapid: string, body: any): Promise<IMapInfo> {
    try {
      const res = await axios.patch(`/api/maps/${mapid}`, body, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw new Error(err);
      }
      throw new Error(JSON.stringify(err.response.data));
    }
  }

  /**
   * @description Получение всех типов узла
   * @param {string} mapid uuid карты
   * @return {Promise<INodeTypeInfo[]>} Список типов
   */
  public async getTypes(mapid: string): Promise<INodeTypeInfo[]> {
    try {
      const res = await axios(`/api/maps/${mapid}/node_types`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw new Error(err);
      }
      throw new Error(JSON.stringify(err.response.data));
    }
  }

  /**
   * @description Получение дерева узлов
   * @async
   * @param {string} mapid uuid карты
   * @param {string} nodeid uuid узла, если не указан то от начала карты
   * @param {number} level_count максимальная глубина при получении узлов
   * @return {Promise<INodeInfo>} Дерево узлов
   */
  public async getTree(
    mapid: string,
    nodeid: string = '',
    levelCount: number = 5
  ): Promise<INodeInfo> {
    try {
      let res;

      res = await axios(`/api/maps/${mapid}/nodes/${nodeid}`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw new Error(err);
      }
      throw new Error(JSON.stringify(err.response.data));
    }
  }

  /**
   * @description Получить все узлы дерева в радиусе
   * @param {string} mapid uuid карты
   * @param {string} nodeid uuid узла
   * @param {number} radius радиус в котором нужно получить узлы
   * @return {Promise<INodeInfo>} Дерево узлов
   */

  public async getRadius(
    mapid: string,
    nodeid: string = '',
    radius: number = 2
  ): Promise<INodeInfo> {
    try {
      let res;

      res = await axios(
        `/api/maps/${mapid}/nodes/${nodeid}/level_radius/${radius}`,
        this.axios
      );
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw new Error(err);
      }
      throw new Error(JSON.stringify(err.response.data));
    }
  }

  /**
   * @description Получить все дочерние узлы с уровнем вложености не более указаной
   * @param {string} mapid uuid карты
   * @param {string} nodeid uuid узла
   * @param {number} level максимальная глубина
   * @return {Promise<INodeInfo>} Дерево узлов
   */

  public async getByLevelCount(
    mapid: string,
    nodeid: string = '',
    level: number = 2
  ): Promise<INodeInfo> {
    try {
      let res;

      res = await axios(
        `/api/maps/${mapid}/nodes/${nodeid}/level_count/${level}`,
        this.axios
      );
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw new Error(err);
      }
      throw new Error(JSON.stringify(err.response.data));
    }
  }

  /**
   * @description Запрос доступа к карте
   * @async
   * @param {string} mapid uuid карты
   * @return {Promise<any>} JSON
   */
  public async requestAccess(
    mapid: string,
    role: string = 'user_r'
  ): Promise<any> {
    try {
      const res = await axios.post(
        `/api/maps/${mapid}/request_access`,
        {
          role,
        },
        this.axios
      );
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
   * @description Создание новой карты
   * @async
   * @param {string} name название карты
   * @return {Promise<IMapInfo>} Информация об карте
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
        throw new Error(err);
      }
      throw new Error(JSON.stringify(err.response.data));
    }
  }

  /**
   * @description Получение списка пользователей на карте
   * @async
   * @param {string} mapid uuid карты
   * @return {Promise<IUserInfoFromMap[]>} JSON
   */
  public async users(mapid: string): Promise<IUserInfoFromMap[]> {
    try {
      const res = await axios.get(`/api/maps/${mapid}/users`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw new Error(err);
      }
      throw new Error(JSON.stringify(err.response.data));
    }
  }

  /**
   * @description Добавляет на карту нового пользоавтеля с указаными правами
   * @param {string} mapid
   * @param {string} access
   * @param {string} nodeId
   * @param {string} sendMail
   * @param {string} username
   * @returns {Promise<IUserInfo[]>}
   */
  public async addUser(
    mapid: string,
    { access, nodeId, sendMail = true, username }: IMapAccessUser
  ): Promise<IUserInfo[]> {
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
      if (!err.response) {
        throw new Error(err);
      }
      throw new Error(JSON.stringify(err.response.data));
    }
  }
}
