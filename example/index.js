const rfwrapper = require('../');

const rf = new rfwrapper({
    host: 'http://***REMOVED***/',
    mail: 'admin@zippiex.com',
    password: '***REMOVED***' // example user
})

rf.user().get.then((data) => {
    console.log(data)
})

rf.use((ctx, next) => {
    if (ctx.who.username !== 'admin@zippiex.com') {
        next()
    }
})

rf.event('node_created', (ctx) => {
    console.log(ctx)
})

rf.initPolling('1bcf5ff3-c392-43db-8e6f-e8090210b0f7').catch((err) => {
    console.error(err)
})