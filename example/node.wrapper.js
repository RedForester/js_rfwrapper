const rf = require('../');

const wrapper = new rf.wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***'
})

// подписка на события карты сразу после того как будут получены данные карты
wrapper.Node('c84d974f-44e3-4e54-9f26-03a493c33586').ready.then((result) => {
    console.log(result)
}).catch((err) => {
    console.log(err)
});