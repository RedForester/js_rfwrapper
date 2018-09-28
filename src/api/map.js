import axios from 'axios'

export async function get (mapid) {
    const res = await axios(`/api/maps/${mapid}`, this.settings.axios)
    return res.data
}

export async function getTypes (mapid) {
    const res = await axios(`/api/maps/${mapid}/node_types`, this.settings.axios)
    return res.data
}

export async function getTree (mapid, nodeid) {
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