# rfwrapper

Попытка написать свой модуль для работы с api RF.
## Пример использования
```js
// в данный момент модуль недоступен в NPM
const rfwrapper = require('rfwrapper');

const rf = new rfwrapper({
    host: 'http://someservername.com/',
    mail: 'sumermega@mail.ru',
    password: 'f6c1ffg48c908feb0f4c3bd36c032e72' 
})

rf.event('node_created', (ctx) => {
    console.log(ctx)
})

rf.initPolling('55555-5555-5555555-55555').catch((err) => {
    console.error(err)
})
```

