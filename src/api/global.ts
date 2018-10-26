import axios from 'axios'
import { IAxios } from '../interfaces'

export default class CGlobal {
    private axios: IAxios;

    constructor(params: IAxios) {
        this.axios = params
    }

    /**
     * Получение всех доступных карт
     * @async
     * @return {map} результат
     */
    public async getMaps() {
        try {
            const res = await axios(`/api/maps`, this.axios)
            return res.data
        } catch (err) {
        if (!err.response) {
            throw err
        }
        throw err.response.data
        }
    }

    /**
     * Последовательное выполнение запросов
     * @async
     * @param {array} body Список запросов
     * @return {object} результат
     */
    public async sendBatch(body: any) {
        try {
            const res = await axios.post(`/api/batch`, body, this.axios)
            return res.data
        } catch (err) {
        if (!err.response) {
            throw err
        }
        throw err.response.data
        }
    }

    /**
     * Поиск узлов по картам
     * @async
     * @param {string} query запрос
     * @param {array} maps uuid карт
     * @return {object} результат поиска
     */
    public async search(query: string, maps: Array < string > ) {
        try {
            const res = await axios.post(`/api/batch`, {
                query,
                map_ids: maps
            }, this.axios)
            return res.data
        } catch (err) {
        if (!err.response) {
            throw err
        }
        throw err.response.data
        }
    }

    /**
     * Получение SID
     * @async
     * @return {string} результат
     */
    public async getSID() {
        try {
            const res = await axios(`/api/server/sid`, this.axios)
            return res.data
        } catch (err) {
        if (!err.response) {
            throw err
        }
        throw err.response.data
        }
    }

    /**
     * Получение всех данных для RF KV
     * @async
     * @return {object} результат
     */
    public async getKV() {
        try {
            const res = await axios(`/api/server/kv`, this.axios)
            return res.data
        } catch (err) {
        if (!err.response) {
            throw err
        }
        throw err.response.data
        }
    }

    /**
     * Получение версии RF
     * @async
     * @return {object} результат
     */
    public async getVersion() {
        try {
            const res = await axios(`/api/version`, this.axios)
            return res.data
        } catch (err) {
        if (!err.response) {
            throw err
        }
        throw err.response.data
        }
    }

    /**
     * Последнее действие над узлами
     * @async
     * @param {string} mapid UUID карты
     * @param {string} kvsession Уникальный индификатор пользователя
     * @param {string} waitVersion Номер нужной записи, если ее нету ее то соединение не будет завершено до тех пор пока не появится
     * @return {data} .
     */
    public async mapNotifLast(mapid: string, kvsession: string, waitVersion: number = 0) {
        try {
            if (waitVersion !== 0) {
                const res = await axios(`/kv/keys/mapNotifLast:${mapid}:${kvsession}?waitVersion=${waitVersion}`, this.axios)
                return res.data
            }
            const res = await axios(`/kv/keys/mapNotifLast:${mapid}:${kvsession}`, this.axios)
            return res.data
        } catch (err) {
        if (!err.response) {
            throw err
        }
        throw err.response.data
        }
    }

    /**
     * Действия за определеный отрезок времени
     * @param {string} mapid UUID карты
     * @param {string} kvsession Уникальный индификатор пользователя
     * @param {string} from Временная отметка откуда начать
     * @param {string} to Временная отметка до куда
     * @return {data} .
     */
    public async mapNotif(mapid: string, kvsession: string, from: string, to: string) {
        try {
            const res = await axios(`/kv/partition/mapNotif:${mapid}:${kvsession}?from=${from}&to=${to}`, this.axios)
            return res.data
        } catch (err) {
        if (!err.response) {
            throw err
        }
        throw err.response.data
        }
    }

    /**
     * Список всех возможных ошибок RF
     * @return {Promise<data>} .
     */
    public async exceptions() {
        const errors:any = {}
        try {
            const res = await axios(`/exceptions`, this.axios)

            res.data.forEach((pref: Array < any > ) => {
                // pref - префикс
                pref.forEach((error: any) => {
                // error - ошибка
                errors[error.prefix + error.code] = error
                })
            })
            return errors
        } catch (err) {
        if (!err.response) {
            throw err
        }
        throw err.response.data
        }
    }
}
