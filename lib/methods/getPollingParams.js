import axios from 'axios'

export default async function () {
    // TODO: получаем данные для сессии KV
    const user = await axios.get('/api/user', this.settings.axios)
    const sid = await axios.get('/api/server/sid', this.settings.axios)
    const kv = await axios.get('/api/server/kv', this.settings.axios)

    return {
        // TODO: добавить лонгпуллинг для всех доступных карт либо придумать где спрашивать карту
        kv: vk.data,
        kv_session: user.data.kv_session,
        sid: sid.data
    }
}