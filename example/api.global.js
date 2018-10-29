const rf = require('../');

const api = new rf.api({
  username: '***REMOVED***',
  password: '8e191f934bf6431a5460be5a07174258',
  host: 'http://app.redforester.com/'
})

api.global.getMaps().then((data) => {
  console.log(data)
}).catch((err) => {
  console.log(err)
})