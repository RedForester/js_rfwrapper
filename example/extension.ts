import { CExtention, NotifyReply, NotifyStyle, Wrapper } from '../src';
import { CommandReply } from '../src/Extension/reply';
import { IExtCommandCtx } from '../src/Extension/interface';
import { Id, Name, Description, ShowRules } from '../src/Extension/decorators';
import { Command } from '../src/Extension/command';


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


const ext = new CExtention()
    .setRfBase('https://***REMOVED***/')
    .setName('somename')
    .setDescription(`some value with ${1 + 3}`)
    .setEmail('deissh@yandex.ru')
    .setBaseUrl('https://e1fbfd8e.ngrok.io:443')

    .command(new SimpleCommand())

ext.register('owner@emai.com', 'somemd5');
ext.start(1233, () => console.log('app listening on port 1233'));
