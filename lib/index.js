import api from './api'
import methods from './methods'
import pkg from '../package.json'

class rfwrapper {
    constructor(settings) {
        if (!settings.mail || !settings.password) {
            throw new Error('You must set user email and password hash!')
        }
        // загружаем информацию о пакете
        this.version = pkg.version

        this.middlewares = []
        this.methods = []

        this.settings = {
            mapid: '',
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

        Object.entries(api).forEach(([key, method]) => {
            this[key] = method.bind(this)
        })

        // импортируем все методы для работы с модулем
        Object.entries(methods).forEach(([key, method]) => {
            this[key] = method.bind(this)
        })
    }

    /*
     * Подписка на определенные события
     */
    event(trigger, ...middlewares) {
        this.event(trigger, ...middlewares)
    }

    /*
     * Создает промежуточные обработчики которые выполняются последовательно,
     * функция выполняется при каждом получении нового события RF
     */
    use(...middlewares) {
        this.use(...middlewares)
    }

    /*
     * Создание LongPolling соединения
     */
    initPolling(mapid) {
        if (!mapid) {
            throw new Error('You must set mapid!')
        }
        return this.startPolling(mapid)
    }
}

module.exports = rfwrapper