import api from './api'
import methods from './methods'
import pkg from '../package.json'

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

        this.middlewares = []
        this.methods = []
        this.api = []

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

        // импортируем все методы для работы с модулем
        Object.entries(methods).forEach(([key, method]) => {
            this[key] = method.bind(this)
        })
        Object.entries(api).forEach(([key, method]) => {
            this.api[key] = {}
            rfapi[key] = {}

            Object.entries(method).forEach(([keym, func]) => {
                rfapi[key][keym] = func.bind(this)
                this.api[key][keym] = func.bind(this)
            })
        })
    }

    /**
     * Подписка на определенные события
     * @param {string} trigger Одно из доступных событий
     * @param  {...object} middlewares Обработчики (указываются последовательно)
     * @returns {promise} Промис
     */
    event(trigger, ...middlewares) {
        this.event(trigger, ...middlewares)
    }

    /**
     * Создает промежуточные обработчики которые выполняются последовательно,
     * функция выполняется при каждом получении нового события RF.
     * @param  {...function} middlewares Обработчики (указываются последовательно)
     * @returns {promise} Промис
     */
    use(...middlewares) {
        this.use(...middlewares)
    }

    /**
     * Создает и запускает LongPoll клиент для выбраной карты
     * @param {string} mapid uuid карты для которой будет работать LongPolling
     * @returns {promise} Промис
     */
    initPolling(mapid) {
        if (!mapid) {
            throw new Error('You must set mapid!')
        }
        return this.startPolling(mapid)
    }
}

module.exports = rfwrapper