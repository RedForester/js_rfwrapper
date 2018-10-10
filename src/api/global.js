import axios from 'axios'

/**
 * Получение всех доступных карт
 * @async
 * @return {object} результат
 */
export async function getMaps () {
    const res = await axios(`/api/maps`, this.settings.axios)
    return res.data
}

/**
 * Последовательное выполнение запросов
 * @async
 * @param {array} body Список запросов
 * @return {object} результат
 */
export async function sendBatch (body) {
    const res = await axios.post(`/api/batch`, body, this.settings.axios)
    return res.data
}

/**
 * Поиск узлов по картам
 * @async
 * @param {string} query запрос
 * @param {array} maps uuid карт
 * @return {object} результат поиска
 */
export async function search(query, maps) {
    const res = await axios.post(`/api/batch`, {
        query,
        map_ids: maps
    }, this.settings.axios)
    return res.data
}

/**
 * Получение SID
 * @async
 * @return {string} результат
 */
export async function getSID() {
    const res = await axios(`/api/server/sid`, this.settings.axios)
    return res.data
}

/**
 * Получение всех данных для RF KV
 * @async
 * @return {object} результат
 */
export async function getKV() {
    const res = await axios(`/api/server/kv`, this.settings.axios)
    return res.data
}

/**
 * Получение версии RF
 * @async
 * @return {object} результат
 */
export async function getVersion() {
    const res = await axios(`/api/version`, this._settings.axios)
    return res.data
}

/**
 * Последнее действие над узлами
 * @async
 * @param {string} mapid UUID карты
 * @param {string} kvsession Уникальный индификатор пользователя
 * @param {string} waitVersion Номер нужной записи, если ее нету ее то соединение не будет завершено до тех пор пока не появится
 * @return {data} .
 */
export async function mapNotifLast(mapid, kvsession, waitVersion = 0) {
    if (waitVersion !== 0) {
        const res = await axios(`/kv/keys/mapNotifLast:${mapid}:${kvsession}?waitVersion=${waitVersion}`, this._settings.axios)
        return res.data
    }
    const res = await axios(`/kv/keys/mapNotifLast:${mapid}:${kvsession}`, this._settings.axios)
    return res.data
}

/**
 * Действия за определеный отрезок времени
 * @param {string} mapid UUID карты
 * @param {string} kvsession Уникальный индификатор пользователя
 * @param {string} from Временная отметка откуда начать
 * @param {string} to Временная отметка до куда
 * @return {data} .
 */
export async function mapNotif(mapid, kvsession, from, to) {
    const res = await axios(`/kv/partition/mapNotif:${mapid}:${kvsession}?from=${from}&to=${to}`, this._settings.axios)
    return res.data
}

/**
 * Список всех возможных ошибок RF
 * @return {Promise<data>} .
 */
export async function exceptions() {
    const errors = {}
    const res = await axios(`/exceptions`, this._settings.axios)

    res.data.forEach((pref) => {
        // pref - префикс
        pref.forEach((error) => {
            // error - ошибка
            errors[error.prefix + error.code] = error
        })
    })

    return errors
}