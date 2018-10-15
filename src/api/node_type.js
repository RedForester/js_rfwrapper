/* eslint-disable func-style */
import axios from 'axios'

/**
 * Информация об типе узла
 * @async
 * @param {string} nodetypeid uuid типа узла
 * @return {Promise} результат
 */
export async function get (nodetypeid) {
    try {
        const res = await axios(`/api/node_types/${nodetypeid}`, this._settings.axios)
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        throw err.response.data
    }
}

/**
 * Создание нового типа
 * @async
 * @returns {Promise} результат
 */
// TODO:
export async function create () {
    try {
        const res = await axios.post(`/api/node_types`, this._settings.axios)
        return res.data
    } catch (err) {
        if (!err.response) {
            throw err
        }
        throw err.response.data
    }
}
