import axios from 'axios'

export default async () => {
    // TODO: получаем данные для сессии KV
    const { data } = await axios.get('/api/user', this.settings.axios)

    return {
        // TODO: добавить лонгпуллинг для всех доступных карт либо придумать где спрашивать карту
        mapid: '',
        kv_session: data.kv_session
    }
}