import { CExtention } from '../src/Extension';

const ext = new CExtention();

const RF_BASE_URL = 'https://***REMOVED***/'

ext
    .setRfBase(RF_BASE_URL)
    .setName('somename')
    .setDescription(`some value with ${1 + 3}`)
    .setEmail('deissh@yandex.ru')
    .setBaseUrl('https://f43ec89f.ngrok.io:443')
    .on('node_updated', async (self, ctx) => {
        if (ctx.data.node_type !== 'Задача') return;
        if (!('properties' in ctx.data) || !ctx.data.properties.byType) return;

        const field = ctx.data.properties.byType.updated.find(f => f.key === 'Статус')
        if (!field) return;

        const username = ctx.who.name && ctx.who.surname
        ? ctx.who.name + ' ' + ctx.who.surname
        : ctx.who.username;

        const reply = `🔔 Пользователь [${username}](${RF_BASE_URL}user?userid=${ctx.who.id}) ` +
            `поменял(а) статус "${field.old_value}" -> "${field.value}".`

        await self.node.addComment(ctx.what, reply);
    })

ext.register('owner@emai.com', 'somemd5');
ext.start(1233, () => console.log('app listening on port 1233'))
