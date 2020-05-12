import { Wrapper, Extention, EventContext } from '../lib';
import { IExtCommandCtx } from '../lib/Extension/interface';
import { ICommandReply, NotifyReply, NotifyStyle } from '../lib/Extension/reply';
import { Command } from '../lib/Extension/command';
import { Event } from '../lib/Extension/event';
import { Id, Name, Description, ShowRules, On, RequiredType } from '../lib/Extension/decorators';

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

@On('node_updated')
class TaskStatusWatcher extends Event {
  public async run(self: Wrapper, ctx: EventContext): Promise<void> {
    if (ctx.data.node_type !== 'Задача') return;
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

    await self.node.addComment(ctx.what, reply);
  }
}

const ext = new Extention({
  name: 'somename',
  email: 'deissh@yandex.ru',
  baseUrl: 'https://86c220d7.ngrok.io:443',
  requiredTypes: [{
    name: 'Категория',
    properties: [{
      name: 'Поле1',
      argument: 'NUMBER_REAL',
      category: 'NUMBER'
    }]
  }]
});

ext.command(new SimpleCommand());
ext.command({id: 'uuid', name: 'somename'}, async (conn, ctx) => {
  return new NotifyReply()
    .setContent('some value')
    .setDuration(5 * 1000);
})
ext.subscribe(new TaskStatusWatcher());
ext.subscribe('*', async (conn, ctx) => {
  console.log(ctx)
})


ext.start(1233, async () => {
  ext.register('adming@google.com', 'md5fromverystrongpassword')
    .then(_ => console.log('Плагин успешно зарегистрирован и подключен'))
    .catch(_ => process.exit(1));
});
