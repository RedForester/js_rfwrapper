import axios from 'axios'

/**
 * Получение информации об узле
 * @async
 * @param {string} nodeid uuid узла
 * @returns {object} информация об узле
 */
export async function get (nodeid) {
    const res = await axios(`/api/nodes/${nodeid}`, this.settings.axios)
    return res.data
}
