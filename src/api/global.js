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