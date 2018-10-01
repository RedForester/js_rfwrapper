import Context from '../context'
import axios from 'axios'

/**
 * Используется для создания LongPoll соединения с RFKV
 * @param  {string} mapid uuid карты для которой будет работать LongPolling
 * @returns {promise} Возвращяет промис
 */
export default async function (mapid) {
    // TODO: добавить общий вид ошибок и коды/названия к ним

    // настройки для работы
    let {
        kv_server,
        kv_session,
        sid,
        lastevent,
        version
    } = await this.getPollingParams(mapid)

    const kvurl = `http://${kv_server}:12000/v2/kv`

    while (true) {
        // TODO: добавить прерывание
        try {
            const { data: newevent } = await axios(
                `${kvurl}/keys/RF:${sid}:mapNotifLast:${mapid}:${kv_session}` 
                    + `?n=3&r=2&w=2&waitTimeout=60&waitVersion=${version}`,
                this.settings.axios
            )
            if (lastevent === '') {
                lastevent = newevent.value
                version = newevent.version
            } else {
                const { data: events } = await axios(
                    `${kvurl}/partition/RF:${sid}:mapNotif:${mapid}:${kv_session}` 
                        + `?to=${newevent.value}&from=${lastevent}`
                        + `n=3&r=2&w=2`,
                    this.settings.axios
                )
                version = newevent.version
                lastevent = newevent.value
                
                events.forEach(event => {
                    this.next(new Context(event.value))
                })
            }
        } catch (err) {
            if (err.response){
                if (err.response.status !== 408){
                    // ошибка 408 -> переподключение
                    console.error('longpolling: ' + err.response.statusText)
                }
            } else {
                console.error(err)
            }
        }
    }
}