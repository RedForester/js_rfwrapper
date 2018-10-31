const rf = require('../');

const api = new rf.api({
  username: '***REMOVED***',
  password: '***REMOVED***',
})

api.global.getMaps().then((data) => {
  console.log(data)
}).catch((err) => {
  console.log(err)
})