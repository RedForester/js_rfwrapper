const rf = require('../');

const wrapper = new rf.wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***'
})

// подписка на события карты сразу после того как будут получены данные карты
wrapper.Map('2b0fb3c2-20f0-4944-8bf1-9dac372a52e9').then((map) => {

  // пример события
  map.on('*', (ctx) => {
    console.log(ctx)
  })

})

// подписка на события без предзагрузки карты
// async/await
// const map = await wrapper.Map('06c5b79d-299d-4787-98ee-bc95459be2b2')

// map.on('node_updated', (ctx, map) => {
//   console.log(ctx)
//   console.log(map)
// })
