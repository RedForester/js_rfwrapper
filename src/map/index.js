import methods from './methods'
import { rfapi } from "../index";

export default class {
    constructor(mapid, settings) {
        this.id = mapid
        this.settings = settings

        this.middlewares = []
        this.methods = []

        this.data = {}
        this.nodes = {}

        Object.entries(methods).forEach(([key, method]) => {
            this[key] = method.bind(this)
        })

        this._initialized = this._initialize()
    }

    /**
     * Получение информации об карте, изменение карты если указано
     * @async
     * @param {object} update Информация которую необходимо изменить
     * @returns {JSON} Информация об узле в виде JSON
     */
    async json(update = {}) {
        await this._initialized
        return this.data
    }

    /**
     * Получение дерева узлов
     * @param {string} nodeid uuid узла-начала дерева
     * @return {Promise<*>} Дерево узлов
     */
    async getNodes(nodeid = '') {
        await this._initialized
        return this.getNodes(this.id, nodeid)
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
     * @async
     * @returns {promise} Промис
     */
    async start() {
        await this._initialize()
        return this.startPolling(this.id)
    }

    /**
     * Иницилизирует карту и загружает информацию из RF API
     * @async
     * @returns {none}.
     */
    async _initialize() {
        this.data = await rfapi.map.get(this.id)
    }
}