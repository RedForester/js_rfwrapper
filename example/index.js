const rfwrapper = require('../');

const rf = new rfwrapper({
    mail: '123',
    password: '412'
})

rf.event('node_updated', (ctx) => {
    console.log(ctx)
})

rf.initPolling()