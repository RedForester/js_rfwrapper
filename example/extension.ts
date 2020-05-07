import { CExtention } from '../src/Extension';

const ext = new CExtention();

ext
    .setName('somename')
    .setDescription(`some value with ${1 + 3}`)
    .setEmail('deissh@yandex.ru')
    .setBaseUrl('https://49c74371.ngrok.io:443')
    .on('*', (ctx) => console.log(ctx))

    .addCmd({ id: 'somefunc', name: 'Какая то функция' }, (ctx) => {
        return ctx
    })
    .addCmd({ id: 'otherfunct', name: 'Отчет', description: 'описание' }, (ctx) => {
        return null
    })


ext.register('owner@emai.com', 'somemd5');
ext.start(1233, () => console.log('app listening on port 1233'))
