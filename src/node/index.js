import * as methods from './methods'
import { rfapi } from '../index'

export default class {
    constructor(nodeid, settings) {
        this.id = nodeid
        this.settings = settings
        this.info = {}
        
        Object.entries(methods).forEach(([key, method]) => {
            this['_' + key] = method.bind(this)
        })
        this._initialized = this._initialize()
    }

    /**
     * Иницилизирует узел и загружает информацию из RF API
     * @async
     * @returns {none}.
     */
    async _initialize() {
        this.info = await rfapi.node.get(this.id)
    }

    /**
     * Получение информации об узле, изменение узла если указано
     * @async
     * @param {JSON} update Информация которую необходимо изменить
     * @returns {JSON} Информация об узле в виде JSON
     */
    async json(update = {}) {
        await this._initialized
        if (update === {}){
            return this.info
        }
    }
}