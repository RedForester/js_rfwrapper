import methods from './methods'
import { rfapi } from "../index";

export default class {
    constructor(mapid, settings) {
        this._id = mapid
        this._settings = settings

        this._middlewares = []
        this._methods = []

        this._data = {}
        this._nodes = {}

        this._longpoll = false

        Object.entries(methods).forEach(([key, method]) => {
            this['_' + key] = method.bind(this)
        })

        this._initialized = this._initialize()
    }

    /**
     * Получение информации об карте, изменение карты если указано
     * @async
     * @returns {JSON} Информация об узле в виде JSON
     */
    async json() {
        await this._initialized
        return this._data
    }

    /**
     * Получение дерева узлов
     * @param {string} nodeid uuid узла-начала дерева
     * @return {Promise<*>} Дерево узлов
     */
    async getNodes(nodeid) {
        await this._initialized
        return this._getNodes(this._id, nodeid ? nodeid : this._data.root_node_id)
    }

    /**
     * Подписка на определенные события
     * @param {string} trigger Одно из доступных событий
     * @param  {...object} middlewares Обработчики (указываются последовательно)
     * @returns {promise} Промис
     */
    event(trigger, ...middlewares) {
        this._event(trigger, ...middlewares)
    }

    /**
     * Создает промежуточные обработчики которые выполняются последовательно,
     * функция выполняется при каждом получении нового события RF.
     * @param  {...function} middlewares Обработчики (указываются последовательно)
     * @returns {promise} Промис
     */
    use(...middlewares) {
        this._use(...middlewares)
    }

    /**
     * Создает и запускает LongPoll клиент для выбраной карты
     * @async
     * @returns {promise} Промис
     */
    async start() {
        await this._initialize()
        this._longpool = true
        return this._start()
    }

    /**
     * Останавливает LongPoll клиент для выбраной карты
     * @async
     * @returns {promise} Промис
     */
    async stop() {
        await this._initialize()
        this._longpool = false
        return true
    }

    /**
     * Иницилизирует карту и загружает информацию из RF API
     * @async
     * @returns {none}.
     */
    async _initialize() {
        this._data = await rfapi.map.get(this._id)
    }
}