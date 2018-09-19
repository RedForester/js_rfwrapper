import methods from './methods'

class rfwrapper {
    constructor(settings) {
        if (!settings.mail || !settings.password) {
            throw new Error('You must set user email and password hash!')
        }
        
        this.middlewares = []
        this.methods = []
        this.settings = {
            mapid: '',
            axios: {
                auth: {
                    username: settings.mail,
                    password: settings.mail,
                },
                baseURL: settings.host || 'http://app.redforester.com',
                responseType: 'json'
            },
            longpooling: settings.longpooling || null
        }

        // import all methods
        Object.entries(methods).forEach(([key, method]) => {
            this[key] = method.bind(this)
        })
    }

    // Add middlewares with triggers for selected events
    event(trigger, ...middlewares) {
        this.event(trigger, ...middlewares)
    }

    // Add reserved middlewares without triggers
    on(...middlewares) {
        this.on(...middlewares)
    }

    // Create polling
    initPolling() {
        return this.startPolling()
    }
}

module.exports = rfwrapper