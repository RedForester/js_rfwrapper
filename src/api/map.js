import axios from 'axios'

export async function get (mapid) {
    const res = await axios(`/api/maps/${mapid}`, this.settings.axios)
    return res.data
}

export async function getTypes (mapid) {
    const res = await axios(`/api/maps/${mapid}/node_types`, this.settings.axios)
    return res.data
}

/**
 * Получение дерева узлов
 * @param {string} mapid uuid карты
 * @param {string} nodeid uuid узла, если не указан то от начала карты
 * @param {number} level_count максимальная глубина при получении узлов
 * @return {Promise<*>} Дерево узлов
 */
export async function getTree (mapid, nodeid = '', level_count = 5) {
    if (nodeid === '') {
        const res = await axios(`/api/maps/${mapid}/nodes/level_count/${level_count}`, this.settings.axios)
        return res.data
    }
    const res = await axios(`/api/maps/${mapid}/nodes/${nodeid}`, this.settings.axios)
    return res.data
}

// FIX: исправить, неработает
export async function create (name = 'New map') {
    const res = await axios.post(`/api/maps`, {
        name
    }, this.settings.axios)
    return res.data
}