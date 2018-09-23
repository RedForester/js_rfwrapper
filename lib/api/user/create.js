import axios from 'axios'

export default async function (self, data) {
    const res = await axios.post(`/api/user`, {
        ...self.settings.axios,
        data
    })
    return res.data
    
}