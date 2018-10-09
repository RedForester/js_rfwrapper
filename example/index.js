const rfwrapper = require('../index');

const rf = new rfwrapper({
    host: 'http://***REMOVED***/',
    mail: 'admin@zippiex.com',
    password: '***REMOVED***' // example user
})

const map = rf.map('1bcf5ff3-c392-43db-8e6f-e8090210b0f7')

console.log(map)

// вызывается на любом событии
map.event('*', (ctx) => {
    console.log(ctx)
})

map.start().catch((err) => {
    console.error(err)
})