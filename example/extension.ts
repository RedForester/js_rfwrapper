import { CExtention, NotifyReply, NotifyStyle, Wrapper } from '../';
import { ICommandReply } from '../lib/Extension/reply';
import { IExtCommandCtx } from '../lib/Extension/interface';
import { Id, Name, Description, ShowRules, On } from '../lib/Extension/decorators';
import { Command } from '../lib/Extension/command';
import { Event } from '../lib/Extension/event';
import Context from '../lib/Map/contex';


@Id('unique-id')
@Name('Название команды')
@Description('Описание команды')
@ShowRules([{ allNodes: true }])
class SimpleCommand extends Command {
    async run(conn: Wrapper, ctx: IExtCommandCtx): Promise<ICommandReply> {
        const user = await conn.user.get(ctx.userId)

        return new NotifyReply()
            .setContent(`Привет ${user.name} ${user.surname}!`)
            .setStyle(NotifyStyle.SUCCESS)
    }
}

@On('node_updated')
class TaskStatusWatcher extends Event {
    public async run(self: Wrapper, ctx: Context): Promise<void> {
        if (ctx.data.node_type !== 'Задача') { return; }
        if (!('properties' in ctx.data) || !ctx.data.properties.byType) { return; }

        const field = ctx.data.properties.byType.updated.find(f => f.key === 'Статус');
        if (!field) { return; }

        const username = ctx.who.name && ctx.who.surname
        ? ctx.who.name + ' ' + ctx.who.surname
        : ctx.who.username;

        const reply = `🔔 Пользователь [${username}](${ext.rfBaseUrl}user?userid=${ctx.who.id}) ` +
            `поменял(а) статус "${field.old_value}" -> "${field.value}".`;

        await self.node.addComment(ctx.what, reply);
    }   
}


const ext = new CExtention()
    .setRfBase('https://***REMOVED***/')
    .setName('somename')
    .setDescription(`some value with ${1 + 3}`)
    .setEmail('deissh@yandex.ru')
    .setBaseUrl('https://83518d86.ngrok.io:443')

    .command(new SimpleCommand())
    .subscribe(new TaskStatusWatcher());


ext.start(1233, async () => {
    await ext.register('kudryavtsev@nppsatek.ru', '2f6d33b8b0f94acfce14d8ec8b4f224f');
    console.log('Плагин успешно зарегистрирован и подключен')
});
