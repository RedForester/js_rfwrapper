const rf = require('../');

const wrapper = new rf.wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***',
  host: 'http://***REMOVED***:8081/'
})

const map = wrapper.Map('1fd251b0-d20f-43ca-9d8f-9cbe09de4710')

map.event('node_updated', (ctx) => {
    console.log(ctx)
})

map.start()