const rf = require('../');

const wrapper = new rf.wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***'
})

// подписка на события карты сразу после того как будут получены данные карты
wrapper.Map('06c5b79d-299d-4787-98ee-bc95459be2b2').ready.then((map) => {
  console.log(map)
  
  // пример события
  map.on('node_updated', (ctx) => {
    console.log(map)
  })

  // запуск лонгпуллинга
  map.start()
})

// подписка на события без предзагрузки карты
// (в момент вызова данные о карте могут быть еще не загруженными)
const map = wrapper.Map('06c5b79d-299d-4787-98ee-bc95459be2b2')

map.on('node_updated', (ctx, map) => {
  console.log(ctx)
  console.log(map)
})

map.start()