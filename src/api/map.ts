import axios from 'axios'
import { IAxios } from '../interfaces'

export default class CMap {
    private axios: IAxios;

    constructor(params: IAxios) {
        this.axios = params
    }
    /**
     * Получение информации об карте
     * @param {string} mapid uuid карты
     * @return {Promise<*>} Информация об карте
     */
    public async get (mapid: string) {
        try {
            const res = await axios(`/api/maps/${mapid}`, this.axios)
            return res.data
        } catch (err) {
            if (!err.response.data) {
                throw err
            }
            throw err.response.data
        }
    }

    /**
     * Получение всех типов узла
     * @param {string} mapid uuid карты
     * @return {Promise<*>} Список типов
     */
    public async getTypes (mapid: string) {
        try {
            const res = await axios(`/api/maps/${mapid}/node_types`, this.axios)
            return res.data
        } catch (err) {
            if (!err.response.data) {
                throw err
            }
            throw err.response.data
        }
    }

    /**
     * Получение дерева узлов
     * @async
     * @param {string} mapid uuid карты
     * @param {string} nodeid uuid узла, если не указан то от начала карты
     * @param {number} level_count максимальная глубина при получении узлов
     * @return {object} Дерево узлов
     */
    public async getTree (mapid: string, nodeid: string = '', level_count: number = 5) {
        try {
            if (nodeid !== '') {
                const res = await axios(`/api/maps/${mapid}/nodes/level_count/${level_count}`, this.axios)
                return res.data
            }
            const res = await axios(`/api/maps/${mapid}/nodes/${nodeid}`, this.axios)
            return res.data
        } catch (err) {
            if (!err.response.data) {
                throw err
            }
            throw err.response.data
        }
    }

    /**
     * Запрос доступа к карте
     * @async
     * @param {string} mapid uuid карты
     * @return {object} JSON
     */
    public async requestAccess (mapid: string) {
        try {
            const res = await axios.post(`/api/maps/${mapid}/request_access`, this.axios)
            return res.data
        } catch (err) {
            if (!err.response.data) {
                throw err
            }
            throw err.response.data
        }
    }

    // FIX: исправить, неработает
    /**
     * Создание новой карты
     * @async
     * @param {string} name название карты
     * @return {object} Информация об карте
     */
    public async create (name = 'New map') {
        try {
            const res = await axios.post(`/api/maps`, {
                name
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
     * Получение списка пользователей на карте
     * @async
     * @param {string} mapid uuid карты
     * @return {object} JSON
     */
    public async users (mapid: string) {
        try {
            const res = await axios.post(`/api/maps/${mapid}/users`, this.axios)
            return res.data
        } catch (err) {
            if (!err.response) {
                throw err
            }
            throw err.response.data
        }
    }
}
