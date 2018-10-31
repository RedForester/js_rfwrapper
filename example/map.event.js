const rf = require('../');

const wrapper = new rf.wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***',
  host: 'http://***REMOVED***/'
})

// подписка на события карты сразу после того как будут получены данные карты
wrapper.Map('1fd251b0-d20f-43ca-9d8f-9cbe09de4710').ready.then((map) => {
  console.log(map)
  
  // пример события
  map.on('node_updated', (ctx) => {
    console.log(ctx)
  })

  // запуск лонгпуллинга
  map.start()
})

// подписка на события без предзагрузки карты
// (в момент вызова данные о карте могут быть еще не загруженными)
const map = wrapper.Map('1fd251b0-d20f-43ca-9d8f-9cbe09de4710')

map.on('node_updated', (ctx, map) => {
  console.log(ctx)
  console.log(map)
})

map.start()