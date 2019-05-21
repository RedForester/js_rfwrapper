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

// Подписка на события карты
const map = wrapper.Map('2b0fb3c2-20f0-4944-8bf1-9dac372a52e9', {
  enablePolling: true
});

// Подписка на все события где был создан новый узел и вывод uuid создателя
// someMidlewere - промежуточный обработчик, например проверка на то что создатель узла являеться администратором карты
map.on('node_created', /* someMidlewere, */ (event) => {
  console.log(event.who);
});

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
