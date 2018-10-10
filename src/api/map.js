import axios from 'axios'

/**
 * Получение информации об карте
 * @param {string} mapid uuid карты
 * @return {Promise<*>} Информация об карте
 */
export async function get (mapid) {
    const res = await axios(`/api/maps/${mapid}`, this._settings.axios)
    return res.data
}

/**
 * Получение всех типов узла
 * @param {string} mapid uuid карты
 * @return {Promise<*>} Список типов
 */
export async function getTypes (mapid) {
    const res = await axios(`/api/maps/${mapid}/node_types`, this._settings.axios)
    return res.data
}

/**
 * Получение дерева узлов
 * @async
 * @param {string} mapid uuid карты
 * @param {string} nodeid uuid узла, если не указан то от начала карты
 * @param {number} level_count максимальная глубина при получении узлов
 * @return {object} Дерево узлов
 */
export async function getTree (mapid, nodeid = '', level_count = 5) {
    if (nodeid === '') {
        const res = await axios(`/api/maps/${mapid}/nodes/level_count/${level_count}`, this._settings.axios)
        return res.data
    }
    const res = await axios(`/api/maps/${mapid}/nodes/${nodeid}`, this._settings.axios)
    return res.data
}

/**
 * Запрос доступа к карте
 * @async
 * @param {string} mapid uuid карты
 * @return {object} JSON
 */
export async function requestAccess (mapid) {
    const res = await axios.post(`/api/maps/${mapid}/request_access`, this._settings.axios)
    return res.data
}

// FIX: исправить, неработает
/**
 * Создание новой карты
 * @async
 * @param {string} name название карты
 * @return {object} Информация об карте
 */
export async function create (name = 'New map') {
    const res = await axios.post(`/api/maps`, {
        name
    }, this._settings.axios)
    return res.data
}

/**
 * Получение списка пользователей на карте
 * @async
 * @param {string} mapid uuid карты
 * @return {object} JSON
 */
export async function users (mapid) {
    const res = await axios.post(`/api/maps/${mapid}/users`, this._settings.axios)
    return res.data
}