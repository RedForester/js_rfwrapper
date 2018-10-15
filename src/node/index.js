import methods from './methods'
import { rfapi } from '../index'

export default class Node {
    constructor(nodeid, settings) {

        /*
         * Модель узла
         * todo: придумать более красивый способ хранения
         */
        this.id = nodeid
        this.map_id = ''
        this.parent = ''
        this.position = []
        this.access = ''
        this.originalParent = ''
        this.body = {
            id: nodeid,
            map_id: '',
            type_id: '',
            properties: {
                style: {},
                byType: {},
                byUser: {},
                global: {
                    title: ''
                }
            },
            parent: '',
            unread_comments_count: 0,
            children: [],
            access: {},
            meta: {
                creation_timestamp: '',
                last_modified_timestamp: '',
                last_modified_user: '',
                author: '',
                editable: true,
                commentable: true
            },
            comments_count: 0
        }
        this.hidden = ''
        this.readers = []
        this.nodelevel = 0
        this.meta = {
            creation_timestamp: '',
                last_modified_timestamp: '',
                last_modified_user: '',
                author: '',
                editable: true,
                commentable: true
        }

        // Private
        this._settings = settings
        this._info = {}

        Object.entries(methods).forEach(([key, method]) => {
            this['_' + key] = method.bind(this)
        })

        this.ready = this._initialize()
    }

    /**
     * Используется для создания нового узла
     * @param {object} properties параметры узла
     * @return {Promise<Node>} .
     */
    async create(properties = {}) {
        await this.ready
        const node = await this.create(properties)
        return node
    }

    /**
     * Получение дочерних узлов
     * @return {Array} список new Node
     */
    get children() {
        const arr = []
        this.body.children.forEach((node) => {
            arr.push(new Node(node.id, this._settings))
        })

        return arr
    }

    /**
     * Получение информации об узле, изменение узла если указано
     * @async
     * @param {JSON} update Информация которую необходимо изменить
     * @returns {JSON} Информация об узле в виде JSON
     */
    async json() {
        await this.ready
        return this._info
    }

    /**
     * Иницилизирует узел и загружает информацию из RF API
     * @async
     * @returns {none}.
     */
    async _initialize() {
        this._info = await rfapi.node.get(this.id)

        Object.entries(this._info).forEach(([name, value]) => {
            this[name] = value
        })
        return this
    }
}