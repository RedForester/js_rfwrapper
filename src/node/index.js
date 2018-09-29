import * as methods from './methods'

export default class {
    constructor(nodeid, settings) {
        this.nodeid = nodeid
        this.settings = settings

        Object.entries(methods).forEach(([key, method]) => {
            this[key] = method.bind(this)
        })
        this.load().then(data => {
            this.data = data
        })
    }
}