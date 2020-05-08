import { CExtention, NotifyReply, NotifyStyle, Wrapper } from '../src';
import { CommandReply } from '../src/Extension/reply';
import { IExtCommandCtx } from '../src/Extension/interface';
import { Id, Name, Description, ShowRules, On } from '../src/Extension/decorators';
import { Command } from '../src/Extension/command';
import { Event } from '../src/Extension/event';
import Context from '../src/Map/contex';


@Id('unique-id')
@Name('Название команды')
@Description('Описание команды')
@ShowRules([{ allNodes: true }])
class SimpleCommand extends Command {
    async run(conn: Wrapper, ctx: IExtCommandCtx): Promise<CommandReply> {
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
    .setBaseUrl('https://e1fbfd8e.ngrok.io:443')

    .command(new SimpleCommand())
    .subscribe(new TaskStatusWatcher())

ext.register('owner@emai.com', 'somemd5');
ext.start(1233, () => console.log('app listening on port 1233'));
