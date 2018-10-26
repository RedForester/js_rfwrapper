const rf = require('../');

const api = new rf.api({
    username: 'admin@zippiex.com',
    password: '***REMOVED***',
    host: 'http://***REMOVED***/'
})

api.global.getMaps().then((data) => {
    console.log(data)
})