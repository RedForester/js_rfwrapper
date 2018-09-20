import axios from 'axios'

export default async function () {
    // TODO: получаем данные для сессии KV
    const userPromise = axios.get('/api/user', this.settings.axios),
          sidPromise = axios.get('/api/server/sid', this.settings.axios),
          kvPromise = axios.get('/api/server/kv', this.settings.axios)
    
    const user = await userPromise,
          sid = await sidPromise,
          kv = await kvPromise  

    return {
        // TODO: добавить лонгпуллинг для всех доступных карт либо придумать где спрашивать карту
        kv_server: kv.data.host,
        kv_session: user.data.kv_session,
        sid: sid.data,
        lastevent: '',
        version: 0
    }
}