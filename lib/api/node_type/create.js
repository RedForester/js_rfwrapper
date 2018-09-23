import axios from 'axios'

export default async function (self, nodetypeid, data) {
    const res = await axios.post(`/api/node_types/${nodetypeid}`, {
        ...self.settings.axios,
        data
    })
    return res.data
    
}