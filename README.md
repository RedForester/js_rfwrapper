# rfwrapper
[![npm version](https://badge.fury.io/js/rfwrapper.svg)](https://www.npmjs.com/package/rfwrapper)

Попытка написать свой модуль для работы с api RF.
## Пример использования
```js
const wrapper = new rf.wrapper({
  username: '***REMOVED***',
  password: '***REMOVED***',
  host: 'http://app.redforester.com/'
})

const map = wrapper.Map('1fd251b0-d20f-43ca-9d8f-9cbe09de4710')

map.event('node_updated', (ctx) => {
    console.log(ctx)
})

map.start()
```

