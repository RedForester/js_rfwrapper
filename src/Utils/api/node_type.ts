import axios from 'axios';
import { IAxios } from '../../interfaces';
import { INodeTypeInfo } from './interfaces';

export default class CNodeType {
  private axios: IAxios;

  constructor(params: IAxios) {
    this.axios = params;
  }
  /**
   * @description Информация об типе узла
   * @async
   * @param {string} nodetypeid uuid типа узла
   * @return {Promise<INodeTypeInfo>} результат
   */
  public async get(nodetypeid: string): Promise<INodeTypeInfo> {
    try {
      const res = await axios(`/api/node_types/${nodetypeid}`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw new Error(err);
      }
      throw new Error(JSON.stringify(err.response.data));
    }
  }

  /**
   * @description Создание нового типа
   * @param map_id map uuid
   * @param name название типа узла
   * @param properties свойства у типа узла
   * @returns {Promise<INodeTypeInfo>}
   */
  public async create(
    map_id: string,
    name: string,
    properties: any = {}
  ): Promise<INodeTypeInfo> {
    try {
      const res = await axios.post(
        `/api/node_types`,
        {
          map_id,
          name,
          properties,
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
