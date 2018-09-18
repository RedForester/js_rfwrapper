import methods from './methods'

class rfwrapper {
    constructor(settings) {
        if (!settings.mail || !settings.password) {
            throw new Error('You must set user email and password!')
        }
        
        this.middlewares = []
        this.methods = []
        this.settings = {
            mail: settings.mail,
            password: settings.mail,
            host: settings.host || 'http://app.redforester.com'
        }

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

module.exports = rfwrapper