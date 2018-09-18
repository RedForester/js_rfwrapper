class rf {
    constructor(settings) {
        if (!settings.mail || !settings.psw) {
            throw new Error('You must set user email and passord!')
        }
        
        this.middlewares = []
        this.methods = []
        this.settings = settings
    }

    // Add middlewares with triggers for selected events
    event(trigger, ...middlewares) {

    }

    // Add reserved middlewares without triggers
    on(...middlewares) {

    }
}

export default rf