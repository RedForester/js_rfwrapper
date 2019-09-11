# rfwrapper

[![npm version](https://badge.fury.io/js/rfwrapper.svg)](https://badge.fury.io/js/rfwrapper)

Попытка написать свой модуль для работы с api RF.

## Установка

Yarn:

```bash
yarn add rfwrapper
```

NPM:

```bash
npm i rfwrapper
```

## Пример использования

Больше примеров можно найти в папке с тестами

Wrapper

```js
const wrapper = new rf.wrapper({
  username: 'admin@google.com',
  password: '123123'
})

// Информация об узле по uuid
wrapper.Node('c84d974f-44e3-4e54-9f26-03a493c33586')
  .then((node) => console.log(node)
  .catch((err) => console.log(err));

// подписка на события карты сразу после того как будут получены данные карты
wrapper.Map('c060bcb4-4c21-4a40-86ca-b4319252d073', { enablePolling: true }).then((map) => {  
  // пример события
  map.on('*', (ctx) => {
    console.log(ctx)
  })

})

```

Api

```js
const api = new rf.Api({
  username: 'admin@google.com',
  password: '123123'
});

// Получить информацию о карте по uuid
api.map.get('b64578f3-2db6-40a3-954e-9d97c3d86794')
  .then(d => console.log(d))
  .catch(e => console.log(e));

// Получить текущего пользователя
api.user.get()
  .then(u => console.log(d))
  .catch(e => console.log(e));

// Получить список узлов в радиусе 3 узлов
api.map.getRadius('b64578f3-2db6-40a3-954e-9d97c3d86794', 3)
  .then(u => console.log(d))
  .catch(e => console.log(e));

// Удаление всех карт у пользователя
api.global.getMaps()
  .then(d => {
    console.log(d)
    return d;
  })
  .then(async(result) => {
    for await (let map of result) {
      await api.map.delete(map.id);
    }
  })
  .catch(e => console.log(e));
```
