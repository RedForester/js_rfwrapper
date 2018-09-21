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

## Документация
### new rfwrapper([options])
 - `options` Опции экземпляра *rfwrapper*

Свойства объекта options и их значения по умолчанию
```js
{
    mail: null, // <String> Почта пользователя
    password: null,  // <String> Хеш от пароля пользователя (md5)
    host: 'http://app.redforester.com/', // <String> Адрес сайта и API сервера
    longpooling: {
        // <Object> Содержит настройки для подключения к RFKV серверу,
        // во время заполняется автоматически иницилизации LongPolling
        kv_server: null, // <String> Адрес RFKV
        kv_session: null, // <String> Сессия пользователя, для каждого пользователя RF уникальная
        sid: null // <Number> RFKV sid
    }
}
```

### initPolling(mapid)
 - `mapid` <String> uuid карты для которой будет работать LongPolling
 - return `Promise<initPolling>`

Пример использования
```js
rf.initPolling('55555-5555-5555555-55555').catch((err) => {
    console.error(err)
})
```

### use(...middlewares)
 - `...middlewares` Обработчики (указываются последовательно)

Создает промежуточные обработчики которые выполняются последовательно, функция выполняется при каждом получении нового события RF.

Пример использования
```js
rf.use((ctx, next) => {
    if (ctx.who.username !== 'admin@zippiex.com') {
        next()
    }
})
```

Если текущая функция промежуточной обработки не завершает цикл, она должна вызвать `next()` для передачи управления следующей функции промежуточной обработки. В противном случае запрос зависнет.

### event(trigger, ...middlewares)
 - `trigger` <String> Одно из доступных событий
 - `...middlewares` Обработчики (указываются последовательно)

Подписка на определенные события

Пример использования
```js
rf.event('node_created', (ctx) => {
    console.log(ctx)
})
```
Содержимое ответа
```js
{
    what: '11111111-1111-1111-1111-1111111111',
    type: 'node_created',
    data: {
        node_title: 'Новый узел - 20:15',
        parent_title: 'какой то очень важный текст'
    },
    sessionId: '8845525168',
    who: {
        id: '44444444-4444-4444-4444-444444444444',
        username: 'sumermega@mail.ru',
        avatar: ''
    }
}
```

Доступные типы событий (все поддерживаемые RF)
 - `node_created`
 - `branch_deleted`
 - `node_deleted`
 - `branch_moved`
 - `node_moved`
 - `node_updated`