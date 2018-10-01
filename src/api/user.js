import axios from 'axios'

export async function get (userid = 'self') {
    if (userid === 'self') {
        const res = await axios(`/api/user`, this.settings.axios)
        return res.data
    }
    const res = await axios(`/api/user/${userid}`, this.settings.axios)
    return res.data
}
