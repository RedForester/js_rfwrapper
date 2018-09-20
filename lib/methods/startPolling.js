import Context from '../context'
import axios from 'axios'

export default async function (mapid) {

    // TODO: добавить общий вид ошибок и коды/названия к ним
    if (!this.settings.longpooling) {
        this.settings.longpooling = await this.getPollingParams(mapid)
    }

    const { data: version } = await axios(
        'http://' + this.settings.longpooling.kv_server +
        ':12000/v2/kv/keys/RF:' + this.settings.longpooling.sid +
        ':mapNotifLast:' + mapid +
        ':' + this.settings.longpooling.kv_session +
        '?n=3&r=2&w=2&waitTimeout=60',
        this.settings.axios
    )

    // handle timeout error and restart polling
    try {
        const { data: event } = await axios(
            'http://' + this.settings.longpooling.kv_server +
            ':12000/v2/kv/keys/RF:' + this.settings.longpooling.sid +
            ':mapNotifLast:' + mapid +
            ':' + this.settings.longpooling.kv_session +
            '?n=3&r=2&w=2&waitTimeout=60&waitVersion=' + version.version,
            this.settings.axios
        )
        console.log(event)
    } catch (err) {
        console.error(err)
        this.startPolling(mapid)
    }
}