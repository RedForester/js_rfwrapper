import methods from './methods'

export default class {
    constructor(uuid, settings) {
        this.nodeid = uuid
        this.settings = settings
        this.data = {}

        Object.entries(methods).forEach(([key, method]) => {
            this[key] = method.bind(this)
        })
    }

    load() {
        this.load()
    }

    get json(){
        return this.data
    }
}