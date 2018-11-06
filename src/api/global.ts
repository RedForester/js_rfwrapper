import axios from 'axios';
import { IAxios } from '../interfaces';

export default class CGlobal {
  private axios: IAxios;

  constructor(params: IAxios) {
    this.axios = params;
  }

  /**
   * Получение всех доступных карт
   * @async
   * @return {Promise<any>} результат
   */
  public async getMaps(): Promise<any> {
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
   * Последовательное выполнение запросов
   * @async
   * @param {array} body Список запросов
   * @return {Promise<any>} результат
   */
  public async sendBatch(body: any): Promise<any> {
    try {
      const res = await axios.post(`/api/batch`, body, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }

  /**
   * Поиск узлов по картам
   * @async
   * @param {string} query запрос
   * @param {array} maps uuid карт
   * @return {Promise<any>} результат поиска
   */
  public async search(query: string, maps: string[]): Promise<any> {
    try {
      const res = await axios.post(
        `/api/batch`,
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
   * Получение SID
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
   * Получение всех данных для RF KV
   * @async
   * @return {Promise<object>} результат
   */
  public async getKV(): Promise<object> {
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

  /**
   * Получение версии RF
   * @async
   * @return {Promise<any>} результат
   */
  public async getVersion(): Promise<any> {
    try {
      const res = await axios(`/api/version`, this.axios);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }

  /**
   * Последнее действие над узлами
   * @async
   * @param {string} mapid UUID карты
   * @param {string} kvsession Уникальный индификатор пользователя
   * @param {string} waitVersion Номер нужной записи, если ее нету ее то соединение не будет завершено до тех пор пока не появится
   * @return {Promise<any>} .
   */
  public async mapNotifLast(
    mapid: string,
    kvsession: string,
    waitVersion: number = 0
  ): Promise<any> {
    try {
      let res;
      if (waitVersion !== 0) {
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
   * Действия за определеный отрезок времени
   * @param {string} mapid UUID карты
   * @param {string} kvsession Уникальный индификатор пользователя
   * @param {string} from Временная отметка откуда начать
   * @param {string} to Временная отметка до куда
   * @return {Promise<any>} .
   */
  public async mapNotif(
    mapid: string,
    kvsession: string,
    from: string,
    to: string
  ): Promise<any> {
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
   * Список всех возможных ошибок RF
   * @return {Promise<any>} .
   */
  public async exceptions(): Promise<any> {
    const errors: any = {};
    try {
      const res = await axios(`/exceptions`, this.axios);

      res.data.forEach((pref: any[]) => {
        // pref - префикс
        pref.forEach((error: any) => {
          // error - ошибка
          errors[error.prefix + error.code] = error;
        });
      });
      return errors;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      throw err.response.data;
    }
  }
}
