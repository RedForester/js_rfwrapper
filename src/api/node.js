import axios from 'axios'

/**
 * Получение информации об узле
 * @async
 * @param {string} nodeid uuid узла
 * @returns {object} информация об узле
 */
export async function get (nodeid) {
    try {
        const res = await axios(`/api/nodes/${nodeid}`, this._settings.axios)
        return res.data
    } catch (err) {
        throw err.response.data
    }
}

/**
 * Создание нового узла
 * @param {string} map_id uuid карты
 * @param {string} parent родитель узла
 * @param {string} position позиция относительно родителя
 * @param {string} properties свойства нового узла
 * @return {Promise<data>} результат
 */
export async function create(map_id, parent, { position = '["R",-1]', properties = {} }) {
    try {
        const res = await axios.post(`/api/nodes/`, {
            map_id,
            parent,
            position,
            properties: JSON.stringify(properties)
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            ...this._settings.axios
        })
        return res.data
    } catch (err) {
        throw err.response.data
    }
}