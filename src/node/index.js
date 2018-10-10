import * as methods from './methods'
import { rfapi } from '../index'

export default class {
    constructor(nodeid, settings) {
        if (nodeid || settings) {
            throw new Error('Must be set node id and setting')
        }

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
            // this['_' + key] = method.bind(this)
        })
        this._initialized = this._initialize()
    }

    /**
     * Получение информации об узле, изменение узла если указано
     * @async
     * @param {JSON} update Информация которую необходимо изменить
     * @returns {JSON} Информация об узле в виде JSON
     */
    async json() {
        await this._initialized
        return this._info
    }

    /**
     * Иницилизирует узел и загружает информацию из RF API
     * @async
     * @returns {none}.
     */
    async _initialize() {
        this._info = await rfapi.node.get(this.id)
    }
}