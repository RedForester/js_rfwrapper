import axios from 'axios'

export async function get (nodeid) {
    const res = await axios(`/api/nodes/${nodeid}`, this.settings.axios)
    return res.data
}
