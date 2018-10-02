import axios from 'axios'

/**
 * Получение всех доступных карт
 * @async
 * @return {object} результат
 */
export async function getMaps () {
    const res = await axios(`/api/maps`, this.settings.axios)
    return res.data
}

/**
 * Последовательное выполнение запросов
 * @async
 * @param {array} body Список запросов
 * @return {object} результат
 */
export async function sendBatch (body) {
    const res = await axios.post(`/api/batch`, body, this.settings.axios)
    return res.data
}

/**
 * Поиск узлов по картам
 * @async
 * @param {string} query запрос
 * @param {array} maps uuid карт
 * @return {object} результат поиска
 */
export async function search(query, maps) {
    const res = await axios.post(`/api/batch`, {
        query,
        map_ids: maps
    }, this.settings.axios)
    return res.data
}

/**
 * Получение SID
 * @async
 * @return {string} результат
 */
export async function getSID() {
    const res = await axios(`/api/server/sid`, this.settings.axios)
    return res.data
}

/**
 * Получение всех данных для RF KV
 * @async
 * @return {object} результат
 */
export async function getKV() {
    const res = await axios(`/api/server/kv`, this.settings.axios)
    return res.data
}

/**
 * Получение версии RF
 * @async
 * @return {object} результат
 */
export async function getVersion() {
    const res = await axios(`/api/version`, this.settings.axios)
    return res.data
}