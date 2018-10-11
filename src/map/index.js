import methods from './methods'
import NodeClass from  '../node'
import { rfapi } from "../index";

export default class Map {
    constructor(mapid, settings) {
        // Public
        this.id = mapid
        this.root_node_id = ''
        this.owner = ''
        this.owner_name = ''
        this.owner_avatar = ''
        this.layout = ''
        this.public = ''
        this.node_count = 0
        this.user_count = 0
        this.name = ''
        this.role = {
            role: '',
            editable: '',
            description: '',
            alias: {
                node: ''
            }
        }

        // Private
        this._settings = settings

        this._middlewares = []
        this._methods = []

        this._info = {}
        this._nodes = []

        this._longpoll = false

        // подключаем методы для работы с картой
        Object.entries(methods).forEach(([key, method]) => {
            this['_' + key] = method.bind(this)
        })

        this.ready = this._initialize()
    }

    /**
     * Получение информации об карте, изменение карты если указано
     * @async
     * @param {object} update Информация которую необходимо изменить
     * @returns {JSON} Информация об узле в виде JSON
     */
    async json(update = {}) {
        await this._initialized
        if (update === {}) {
            return this.data
        }
    }

    /**
     * Получение дерева узлов
     * @param {string} nodeid uuid узла-начала дерева
     * @param {number} level_count глибина получения
     * @return {Promise<tree>} Дерево узлов
     */
    async getNodes(nodeid = this._info.root_node_id, level_count = 1) {
        await this.ready
        const nodes = await rfapi.map.getTree(this.id, nodeid, level_count)
        nodes.body.children.forEach((nodes) => {
            this._nodes.push(new NodeClass(nodes.id))
        })

        return this._nodes
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
        await this.ready()
        this._longpool = true
        return this._start()
    }

    /**
     * Останавливает LongPoll клиент для выбраной карты
     * @async
     * @returns {promise} Промис
     */
    async stop() {
        await this.ready()
        this._longpool = false
        return true
    }

    /**
     * Иницилизирует карту и загружает информацию из RF API
     * @async
     * @returns {none}.
     */
    async _initialize() {
        this._info = await rfapi.map.get(this.id)

        Object.entries(this._info).forEach(([name, value]) => {
            this[name] = value
        })

        return this
    }

    /**
     * Вызывается после загрузки карты
     * @return {Promise<void>} .
     */
    async loaded () {
        await this.ready()
    }
}