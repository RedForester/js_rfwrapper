const rf = require('../');

const api = new rf.Api({
  username: '***REMOVED***',
  password: '***REMOVED***',
})

api.user.get('6dbfa213-defa-43d1-9215-c232e8485978').then((data) => {
  console.log(data)
}).catch((err) => {
  console.log(err)
})
