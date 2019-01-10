import axios from 'axios';
import { IAxios } from '../../interfaces';
import { IMapInfo } from '../../Map/interface';
import {
  IBatch,
  IBatchResult,
  ISearchResult,
  IMapNotifLast,
  IMapNotif,
  IExceptions,
} from './interfaces';

export default class CGlobal {
  /**
   * @description Axios params
   */
  private axios: IAxios;

  constructor(params: IAxios) {
    this.axios = params;
  }

  /**
   * @description Получение всех доступных карт
   * @async
   * @return {Promise<IMapInfo[]>} результат
   */
  public async getMaps(): Promise<IMapInfo[]> {
    try {
      const res = await axios(`/api/maps`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }

  /**
   * @description Последовательное выполнение запросов
   * @async
   * @param {IBatch[]} body Список запросов
   * @return {Promise<IBatchResult[]>} результат
   */
  public async sendBatch(body: IBatch[]): Promise<IBatchResult[]> {
    try {
      const res = await axios.post('/api/batch', body, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }

  /**
   * @description Поиск узлов по картам
   * @async
   * @param {string} query запрос
   * @param {string[]} maps uuid карт
   * @return {Promise<ISearchResult>} результат поиска
   */
  public async search(query: string, maps: string[]): Promise<ISearchResult> {
    try {
      const res = await axios.post(
        '/api/search',
        {
          query,
          map_ids: maps,
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
   * @description Получение SID
   * @async
   * @return {Promise<string>} результат
   */
  public async getSID(): Promise<string> {
    try {
      const res = await axios(`/api/server/sid`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }

  /**
   * @description Получение всех данных для RF KV
   * @async
   * @return {Promise<any>} результат
   */
  public async getKV(): Promise<any> {
    try {
      const res = await axios(`/api/server/kv`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }

  // /**
  //  * Получение версии RF
  //  * @async
  //  * @return {Promise<any>} результат
  //  */
  // public async getVersion(): Promise < any > {
  //   try {
  //     const res = await axios(`/api/version`, this.axios);
  //     return res.data;
  //   } catch (err) {
  //     if (!err.response) {
  //       throw err;
  //     }
  //     throw err.response.data;
  //   }
  // }

  /**
   * @description Последнее действие над узлами
   * @async
   * @param {string} mapid UUID карты
   * @param {string} kvsession Уникальный индификатор пользователя
   * @param {string} waitVersion Номер нужной записи, если ее нету ее то соединение не будет завершено до тех пор пока не появится
   * @return {Promise<IMapNotifLast>} последнее действие на карте
   */
  public async mapNotifLast(
    mapid: string,
    kvsession: string,
    waitVersion: string = ''
  ): Promise<IMapNotifLast> {
    try {
      let res;
      if (waitVersion !== '') {
        res = await axios(
          `/kv/keys/mapNotifLast:${mapid}:${kvsession}?waitVersion=${waitVersion}`,
          this.axios
        );
        return res.data;
      }
      res = await axios(
        `/kv/keys/mapNotifLast:${mapid}:${kvsession}`,
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
   * @description Действия за определеный отрезок времени
   * @param {string} mapid UUID карты
   * @param {string} kvsession Уникальный индификатор пользователя
   * @param {string} from Временная отметка откуда начать
   * @param {string} to Временная отметка до куда
   * @return {Promise<IMapNotif[]>} .
   */
  public async mapNotif(
    mapid: string,
    kvsession: string,
    from: string,
    to: string
  ): Promise<IMapNotif[]> {
    try {
      const res = await axios(
        `/kv/partition/mapNotif:${mapid}:${kvsession}?from=${from}&to=${to}`,
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
   * @description Список всех возможных ошибок RF
   * @return {Promise<IExceptions>} .
   */
  public async exceptions(): Promise<IExceptions> {
    const errors: any = {};
    const res = await axios(`/exceptions`, this.axios);

    res.data.forEach((pref: any[]) => {
      // pref - префикс
      pref.forEach((error: any) => {
        // error - ошибка
        errors[error.prefix + error.code] = error;
      });
    });
    return errors;
  }
}
