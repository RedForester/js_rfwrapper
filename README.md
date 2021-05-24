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

Больше примеров можно найти в папке `example` или в папке с тестами 

Пример плагина для RF который слушает события на подключеных картах и добавляет команду `somename` на корень карты.

```ts
import { Extention } from 'rfwrapper';
import { NotifyReply } from 'rfwrapper/Extension/reply';

const ext = new Extention({
  name: 'somename', // уникальное название плагина
  email: 'deissh@yandex.ru', // емаил автора
  baseUrl: 'https://86c220d7.ngrok.io:443', // аддрес по которому доступен плагин
});

// создаем команду которая будет доступна только на корне карты
ext.command(
  {
    id: 'uuid', // уникальное название команды внутри плагина
    name: 'somename', // название которое будет видеть пользователь
    showRules: [{ root: true }] // правила по которым команда отображается в клиенте RF
  },
  async () => new NotifyReply() // показываем пользователю уведомление
    .setContent('some value') // с текстом some value
    .setDuration(5 * 1000); // 5 секунд
)

// подписываемся на все события которые происходят на подключеных картах
ext.subscribe('*', async (conn, ctx) => {
  console.log(ctx)
})

// запускаем плагин на 1233 порту
ext.start(1233, async () => {
  // после успешного запуска регистрируем плагин используя свой аккаунт
  ext.register('adming@google.com', 'md5fromverystrongpassword')
    .then(_ => console.log('Плагин успешно зарегистрирован и подключен'))
    .catch(_ => process.exit(1));
});
```

Пример плагина для слежения за статусом задач с использованием декораторов. Только с TypeScript и включеным `experimentalDecorators`.

```ts
import { Wrapper, Extention, EventContext } from 'rfwrapper';
import { IExtCommandCtx } from 'rfwrapper/Extension/interface';
import { ICommandReply, NotifyReply, NotifyStyle } from 'rfwrapper/Extension/reply';
import { Command } from 'rfwrapper/Extension/command';
import { Event } from 'rfwrapper/Extension/event';
import { Id, Name, Description, ShowRules, On, RequiredType } from 'rfwrapper/Extension/decorators';

@Id('unique-id')
@Name('Название команды')
@Description('Описание команды')
@ShowRules({ allNodes: true })
@RequiredType('Задача')
@RequiredType('Постановка', [])
class SimpleCommand extends Command {
  public async run(conn: Wrapper, ctx: IExtCommandCtx): Promise<ICommandReply> {
    const user = await conn.user.get(ctx.userId);

    return new NotifyReply()
      .setContent(`Привет ${user.name} ${user.surname}!`)
      .setStyle(NotifyStyle.SUCCESS);
  }
}

// данный код сработает только если пришло событие о обновлении узла
@On('node_updated')
class TaskStatusWatcher extends Event {
  public async run(self: Wrapper, ctx: EventContext): Promise<void> {
    // проверяем что это тип узла - задача и обновилось типовое поле
    if (ctx.data.node_type.name !== 'Задача') return;
    if (!('properties' in ctx.data) || !ctx.data.properties.byType) return;

    const field = ctx.data.properties.byType.updated.find(f => f.key === 'Статус');
    if (!field) return;

    const username =
      ctx.who.name && ctx.who.surname
        ? ctx.who.name + ' ' + ctx.who.surname
        : ctx.who.username;

    const reply =
      `🔔 Пользователь [${username}](${ext.rfBaseUrl}user?userid=${ctx.who.id}) `
      + `поменял(а) статус "${field.old_value}" -> "${field.value}".`;

    // добавляем новый комментарий о том что поле изменилось
    await self.node.addComment(ctx.what, reply);
  }
}

const ext = new Extention({
  name: 'somename', // уникальное название плагина
  email: 'deissh@yandex.ru', // емаил автора
  baseUrl: 'https://86c220d7.ngrok.io:443', // аддрес по которому доступен плагин
});

// добавляем нового слушателя событий
ext.subscribe(new TaskStatusWatcher());
// добавляем новую команду
ext.command(new SimpleCommand());

// запускаем плагин на 1233 порту
ext.start(1233, async () => {
  // после успешного запуска регистрируем плагин используя свой аккаунт
  ext.register('adming@google.com', 'md5fromverystrongpassword')
    .then(_ => console.log('Плагин успешно зарегистрирован и подключен'))
    .catch(_ => process.exit(1));
});
```

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
const wrapper = new rf.wrapper({
  username: 'admin@google.com',
  password: '123123'
})

// Получить информацию о карте по uuid
wrapper.map.get('b64578f3-2db6-40a3-954e-9d97c3d86794')
  .then(d => console.log(d))
  .catch(e => console.log(e));

// Получить текущего пользователя
wrapper.user.get()
  .then(u => console.log(d))
  .catch(e => console.log(e));

// Получить список узлов в радиусе 3 узлов
wrapper.map.getRadius('b64578f3-2db6-40a3-954e-9d97c3d86794', 3)
  .then(u => console.log(d))
  .catch(e => console.log(e));

// Удаление всех карт у пользователя
wrapper.global.getMaps()
  .then(d => {
    console.log(d)
    return d;
  })
  .then(async(result) => {
    for await (let map of result) {
      await wrapper.map.delete(map.id);
    }
  })
  .catch(e => console.log(e));
```
