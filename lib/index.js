import methods from './methods'
import api from './api'

class rf {
    constructor(settings) {
        if (!settings.mail || !settings.psw) {
            throw new Error('You must set user email and passord!')
        }
        
        this.api = api
        this.middlewares = []
        this.methods = []
        this.settings = settings

        // import all methods
        Object.entries(methods).forEach(([key, method]) => {
            this[key] = method.bind(this)
        })
    }

    // Add middlewares with triggers for selected events
    event(trigger, ...middlewares) {
        this.event(triggers, ...middlewares)
    }

    // Add reserved middlewares without triggers
    on(...middlewares) {
        this.on(...middlewares)
    }
}

export default rf