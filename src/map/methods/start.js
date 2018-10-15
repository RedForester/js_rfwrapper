import Context from './context'
import { rfapi } from "../../index";

/**
 * Используется для создания LongPoll соединения с RFKV
 * @async
 * @returns {promise} Возвращяет промис
 */
export default async function start () {
    // TODO: добавить общий вид ошибок и коды/названия к ним

    // настройки для работы
    const user = await rfapi.user.get()
    let version = 0,
        lastevent = ''

    while (this._longpool === true) {
        try {
            const newevent = await rfapi.global.mapNotifLast(this.id, user.kv_session, version)
            if (lastevent === '') {
                lastevent = newevent.value
                version = newevent.version
            } else {
                const events = await rfapi.global.mapNotif(this.id, user.kv_session, lastevent, newevent.value)

                version = newevent.version
                lastevent = newevent.value

                events.forEach(event => {
                    this._next(new Context(event.value))
                })
            }
        } catch (err) {
            if (err.response){
                // ошибка 408 -> переподключение, иначе останавливаем
                if (err.response.status !== 408){
                    console.error('longpolling: ' + err.response.statusText)
                    this._longpool = false
                }
            } else {
                console.error('longpolling: ' + err)
                this._longpool = false
            }
        }
    }
}