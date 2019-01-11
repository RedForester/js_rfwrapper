const rf = require('../');

const wrapper = new rf.Wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***',
  host: 'http://***REMOVED***'
})

// подписка на события карты сразу после того как будут получены данные карты
wrapper.Map('2b0fb3c2-20f0-4944-8bf1-9dac372a52e9', { enablePolling: true }).then((map) => {
  // пример события
  map.on('*', (ctx) => {
    console.log(ctx)
  })

}).catch(err => {
  console.log(err);
  
})
