import methods from '../methods'

export default class {
    constructor(uuid, settings) {
        this.mapid = uuid
        this.settings = settings

        this.middlewares = []
        this.methods = []

        this.nodes = {}

        Object.entries(methods).forEach(([key, method]) => {
            this[key] = method.bind(this)
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
     * @returns {promise} Промис
     */
    start() {
        return this.startPolling(this.mapid)
    }
}