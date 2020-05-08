import { CExtention, NotifyReply, NotifyStyle, Wrapper } from '../src';
import { CommandReply } from '../src/Extension/reply';
import { IExtCommandCtx } from '../src/Extension/interface';
import Context from '../src/Map/contex';


function setMetaData(key: string, value: unknown): ClassDecorator {
    return function<T extends Function>(target: T): T {
        Object.defineProperty(target.prototype, key, {
            value,
            enumerable: false,
            configurable: true,
            writable: true
        });
        return target;
    };
  }

export function Name(name: string): ClassDecorator {
    return setMetaData('commandName', name);
}

const ext = new CExtention();

class ExamplePlugin{
    @ext.showRule('root', true)
    @ext.showRule('selfType', 'Задача')
    @ext.command('hi', 'some description')
    async simplehandler(conn: Wrapper, ctx: IExtCommandCtx): Promise<CommandReply> {
        const user = await conn.user.get(ctx.userId)

        return new NotifyReply()
            .setContent(`Привет ${user.name} ${user.surname}!`)
            .setStyle(NotifyStyle.SUCCESS)
    }

    @ext.on('node_updated')
    async simpleevent(self: Wrapper, ctx: Context): Promise<void> {
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

ext
    .setRfBase('https://***REMOVED***/')
    .setName('somename')
    .setDescription(`some value with ${1 + 3}`)
    .setEmail('deissh@yandex.ru')
    .setBaseUrl('https://e1fbfd8e.ngrok.io:443')

ext.register('owner@emai.com', 'somemd5');
ext.start(1233, () => console.log('app listening on port 1233'));
