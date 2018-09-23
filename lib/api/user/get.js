import axios from 'axios'

export default async function (self, userid) {
    if (userid === 'self') {
        const res = await axios(`/api/user`, self.settings.axios)
        return res.data
    } 
    const res = await axios(`/api/user/${userid}`, self.settings.axios)
    return res.data
    
}