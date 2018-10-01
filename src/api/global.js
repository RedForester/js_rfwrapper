import axios from 'axios'

export async function getMaps () {
    const res = await axios(`/api/maps`, this.settings.axios)
    return res.data
}

export async function sendBatch (body) {
    const res = await axios.post(`/api/batch`, body, this.settings.axios)
    return res.data
}

/**
 * Поиск узлов по картам
 * @param {string} query
 * @param {list} maps
 * @return {Promise<>}
 */
export async function search(query, maps) {
    const res = await axios.post(`/api/batch`, {
        query,
        map_ids: maps
    }, this.settings.axios)
    return res.data
}