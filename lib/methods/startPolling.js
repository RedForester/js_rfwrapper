import Context from '../context'
import axios from 'axios'

export default async function (mapid) {
    // TODO: добавить общий вид ошибок и коды/названия к ним
    if (!this.settings.longpooling) {
        this.settings.longpooling = await this.getPollingParams(mapid)
    }

    const sid = this.settings.longpooling.sid,
          kv_server = this.settings.longpooling.kv_server,
          kv_session = this.settings.longpooling.kv_session
    
    const { data: version} = await axios(
        'http://' + kv_server + ':12000/v2/kv/keys/RF:' + sid 
            + ':mapNotifLast:' + mapid + ':' + kv_session
            + '?n=3&r=2&w=2&waitTimeout=60',
        this.settings.axios
    )

    this.next(new Context('node_updated', version))
}