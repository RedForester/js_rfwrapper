# rfwrapper
[![npm version](https://badge.fury.io/js/rfwrapper.svg)](https://www.npmjs.com/package/rfwrapper)

Попытка написать свой модуль для работы с api RF.
## Пример использования
```js
const wrapper = new rf.wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***'
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
```

