import axios from 'axios'

/**
 * Получение информации об пользователе
 * @async
 * @param {string} userid uuid пользователя
 * @returns {object} информация об пользователе
 */
export async function get (userid = 'self') {
    if (userid === 'self') {
        const res = await axios(`/api/user`, this._settings.axios)
        return res.data
    }
    const res = await axios(`/api/user/${userid}`, this._settings.axios)
    return res.data
}
