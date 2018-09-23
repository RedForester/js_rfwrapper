import axios from 'axios'

export default async function (self, nodetypeid) {
    const res = await axios(`/api/node_types/${nodetypeid}`, self.settings.axios)
    return res.data
    
}