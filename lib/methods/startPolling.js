import Context from '../context'
import axios from 'axios'

export default async function (mapid) {
    try {
        // TODO: добавить общий вид ошибок и коды/названия к ним
        if (!this.settings.longpooling) {
            this.settings.longpooling = await this.getPollingParams(mapid)
        }
        
        const { data: version } = await axios(
            'http://' + this.settings.longpooling.kv_server
                + ':12000/v2/kv/keys/RF:' + this.settings.longpooling.sid 
                + ':mapNotifLast:' + mapid
                + ':' + this.settings.longpooling.kv_session
                + '?n=3&r=2&w=2&waitTimeout=60',
            this.settings.axios
        )

        this.next(new Context('node_updated', version))
    } catch (err) {
        this.settings.longpooling = null
        this.startPolling(mapid)
    }
}