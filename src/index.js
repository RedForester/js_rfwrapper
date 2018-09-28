import api from './api'
import pkg from '../package.json'

import MapClass from './map'

export const rfapi = {}

class rfwrapper {

    /**
     * Создает rfwrapper для работы с api RF
     * @param {object} settings Параметрый для настройки rfwrapper`а
     */
    constructor(settings) {
        if (!settings.mail || !settings.password) {
            throw new Error('You must set user email and password hash!')
        }
        // загружаем информацию о пакете
        this.version = pkg.version
        this.api = []

        this.settings = {
            axios: {
                auth: {
                    username: settings.mail,
                    password: settings.password,
                },
                baseURL: settings.host || 'http://app.redforester.com/',
                responseType: 'json'
            },
            longpooling: settings.longpooling || null
        }

        // импортируем все методы для работы с модулем
        Object.entries(api).forEach(([key, method]) => {
            this.api[key] = {}
            rfapi[key] = {}

            Object.entries(method).forEach(([keym, func]) => {
                rfapi[key][keym] = func.bind(this)
                this.api[key][keym] = func.bind(this)
            })
        })
    }

    map(mapid){
        // лайвхак из за бейбла 6ой версии, переписать
        return new MapClass(mapid, this.settings)
    }

    version(){
        return this.version
    }
}

module.exports = rfwrapper