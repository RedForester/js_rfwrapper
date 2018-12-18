const rf = require('../');

const api = new rf.Api({
  username: '***REMOVED***',
  password: '8e191f934bf6431a5460be5a07174258',
})

api.map.getTree("0d0e3f32-9b02-4ea1-8519-9e32d3b414a2", "f46a6b28-6f0a-4cb8-b98f-1b1968c8d9bc", 10000).then((d) => {
  console.log(d)
}).catch((err) => {
  console.log("[err] " + err.message)
})