const rfwrapper = require('../');

const rf = new rfwrapper({
    mail: '123',
    password: '412'
})

rf.event('node_updated', (err, data) => {
    console.log(data)
})