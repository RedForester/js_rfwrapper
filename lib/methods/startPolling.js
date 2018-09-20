import Context from '../context'
import axios from 'axios'

export default async function (mapid) {
    // TODO: добавить общий вид ошибок и коды/названия к ним
    // TODO: ПЕРЕДЕЛАТЬ
    if (!this.settings.longpooling) {
        this.settings.longpooling = await this.getPollingParams(mapid)
    }

    // handle timeout error and restart polling
    try {
        const { data: newevent } = await axios(
            'http://' + this.settings.longpooling.kv_server +
            ':12000/v2/kv/keys/RF:' + this.settings.longpooling.sid +
            ':mapNotifLast:' + mapid +
            ':' + this.settings.longpooling.kv_session +
            '?n=3&r=2&w=2&waitTimeout=60&waitVersion='
            + this.settings.longpooling.version,
            this.settings.axios
        )
        if (this.settings.longpooling.lastevent === '') {
            this.settings.longpooling.lastevent = newevent.value
            this.settings.longpooling.version = newevent.version
        } else {
            const { data: events } = await axios(
                'http://' + this.settings.longpooling.kv_server 
                + ':12000/v2/kv/partition/RF:'
                + this.settings.longpooling.sid + ':mapNotif:'
                + mapid + ':' + this.settings.longpooling.kv_session + '?to='
                + newevent.value + '&from='
                + this.settings.longpooling.lastevent + '&n=3&r=2&w=2',
                this.settings.axios
            )
            this.settings.longpooling.version = newevent.version
            this.settings.longpooling.lastevent = newevent.value
            
            events.forEach(event => {
                this.next(new Context(event.value))
            })
        }
    } catch (err) {
        // 408 ошибка - переподключение
    }
    this.startPolling(mapid)
}