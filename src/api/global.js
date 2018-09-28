import axios from 'axios'

export async function getMaps () {
    const res = await axios(`/api/maps`, this.settings.axios)
    return res.data
}

export async function sendBatch (body) {
    const res = await axios.post(`/api/batch`, body, this.settings.axios)
    return res.data
}