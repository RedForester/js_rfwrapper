import methods from './methods'

class rfwrapper {
    constructor(settings) {
        if (!settings.mail || !settings.password) {
            throw new Error('You must set user email and password hash!')
        }
        
        this.middlewares = []
        this.methods = []
        this.settings = {
            // TODO: добавить выбор карты
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
        this.event(triggers, ...middlewares)
    }

    // Add reserved middlewares without triggers
    on(...middlewares) {
        this.on(...middlewares)
    }
}

module.exports = rfwrapper