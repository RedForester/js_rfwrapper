import { CExtention, NotifyReply, NotifyStyle } from '../src';

const ext = new CExtention();

ext
    .setRfBase('https://***REMOVED***/')
    .setName('somename')
    .setDescription(`some value with ${1 + 3}`)
    .setEmail('deissh@yandex.ru')
    .setBaseUrl('https://e1fbfd8e.ngrok.io:443')
    .on('node_updated', async (self, ctx) => {
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
    })

    .command({ id: 'simple-handler', name: 'Текст кнопки' }, async (conn, ctx) => {
        const user = await conn.user.get(ctx.userId)

        return new NotifyReply()
            .setContent(`Привет ${user.name} ${user.surname}!`)
            .setStyle(NotifyStyle.DEFAULT)
    })


ext.register('owner@emai.com', 'somemd5');
ext.start(1233, () => console.log('app listening on port 1233'));
