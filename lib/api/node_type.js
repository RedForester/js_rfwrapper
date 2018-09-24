/* eslint-disable func-style */
import axios from 'axios'

export async function get (nodetypeid) {
    const res = await axios(`/api/node_types/${nodetypeid}`, this.settings.axios)
    return res.data
}

export async function create (data = {}) {
    const res = await axios.post(`/api/node_types`, {
        ...this.settings.axios,
        data
    })
    return res.data
}
