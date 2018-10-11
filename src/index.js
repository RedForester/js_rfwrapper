import api from './api'
import pkg from '../package.json'

import MapClass from './map'
import NodeClass from './node'

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
        this._version = pkg.version
        this._api = []

        this._settings = {
            axios: {
                auth: {
                    username: settings.mail,
                    password: settings.password,
                },
                baseURL: settings.host || 'http://app.redforester.com/',
                responseType: 'json',
            },
            longpooling: settings.longpooling || null,
        }

        // импортируем все методы для работы с модулем
        Object.entries(api).forEach(([key, method]) => {
            this._api[key] = {}
            // сохдаем копию для работы из вне класса
            rfapi[key] = {}

            Object.entries(method).forEach(([keym, func]) => {
                rfapi[key][keym] = func.bind(this)
                this._api[key][keym] = func.bind(this)
            })
        })
    }

    map(mapid) {
        return new MapClass(mapid, this._settings)
    }

    node(nodeid) {
        return new NodeClass(nodeid, this._settings)
    }

    get api() {
        return this._api
    }

    get version() {
        return this._version
    }
}

module.exports = rfwrapper